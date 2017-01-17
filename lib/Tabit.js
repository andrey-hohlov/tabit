'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isDom = require('is-dom');
var matches = require('dom-matches');

var Tabit = function () {
  function Tabit(elem) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Tabit);

    if (!isDom(elem)) {
      throw new TypeError('`new Tabit` requires a DOM element as its first argument.');
    }

    // Destroy if already initialized on this element
    if (elem._tabit) {
      elem._tabit.destroy();
    }

    /**
     * Prepare config
     */

    // Tricky merge
    // https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20&%20beyond/ch2.md#nested-defaults-destructured-and-restructured
    /* eslint-disable prefer-const */
    var _options$btnSelector = options.btnSelector,
        btnSelector = _options$btnSelector === undefined ? 'a' : _options$btnSelector,
        _options$contentSelec = options.contentSelector,
        contentSelector = _options$contentSelec === undefined ? 'div' : _options$contentSelec,
        _options$btnAttr = options.btnAttr,
        btnAttr = _options$btnAttr === undefined ? 'href' : _options$btnAttr,
        _options$contentAttr = options.contentAttr,
        contentAttr = _options$contentAttr === undefined ? 'id' : _options$contentAttr,
        _options$btnActiveCla = options.btnActiveClass,
        btnActiveClass = _options$btnActiveCla === undefined ? null : _options$btnActiveCla,
        _options$contentActiv = options.contentActiveClass,
        contentActiveClass = _options$contentActiv === undefined ? null : _options$contentActiv,
        _options$event = options.event,
        event = _options$event === undefined ? 'click' : _options$event,
        _options$active = options.active,
        active = _options$active === undefined ? 0 : _options$active,
        _options$toggleDispla = options.toggleDisplay,
        toggleDisplay = _options$toggleDispla === undefined ? true : _options$toggleDispla,
        _options$closable = options.closable,
        closable = _options$closable === undefined ? false : _options$closable,
        _options$beforeInit = options.beforeInit,
        beforeInit = _options$beforeInit === undefined ? null : _options$beforeInit,
        _options$onInit = options.onInit,
        onInit = _options$onInit === undefined ? null : _options$onInit,
        _options$beforeChange = options.beforeChange,
        beforeChange = _options$beforeChange === undefined ? null : _options$beforeChange,
        _options$onChange = options.onChange,
        onChange = _options$onChange === undefined ? null : _options$onChange,
        _options$onDestroy = options.onDestroy,
        onDestroy = _options$onDestroy === undefined ? null : _options$onDestroy;
    /* eslint-enable prefer-const */

    this.settings = { btnSelector: btnSelector, contentSelector: contentSelector, btnAttr: btnAttr, contentAttr: contentAttr, btnActiveClass: btnActiveClass, contentActiveClass: contentActiveClass, event: event, active: active, toggleDisplay: toggleDisplay, closable: closable, beforeInit: beforeInit, onInit: onInit, beforeChange: beforeChange, onChange: onChange, onDestroy: onDestroy }; // eslint-disable-line max-len

    this._checkSettings();

    /**
     * Create tabs collection
     */

    this.elem = elem;
    this.tabs = [];
    this.activeTab = null;

    var btns = this.elem.querySelectorAll(this.settings.btnSelector);
    btns = Array.prototype.slice.call(btns);
    var contents = this.elem.querySelectorAll(this.settings.contentSelector);
    contents = Array.prototype.slice.call(contents);

    var findTabContent = function findTabContent(btn) {
      var attrValue = btn.getAttribute(btnAttr);
      var content = false;

      if (!attrValue) return false;

      // Replace first `#` in href attribute
      if (btnAttr === 'href') {
        attrValue = attrValue.replace(/^#/g, '');
      }

      // Find content for this tab and remove it from list for more fast next search
      contents.some(function (item, i, arr) {
        if (item.getAttribute(contentAttr) === attrValue) {
          content = arr[i];
          arr.splice(i, 1);
          return content;
        }
        return false;
      });

      return content;
    };

    btns.forEach(function (item) {
      var btn = item;
      var content = findTabContent(item);
      if (!content) return;
      _this.tabs.push({
        btnNode: btn,
        contentNode: content
      });
    });

    /**
     * Init
     */

    // Run event handler if fired on button
    // It store in each new instance and link to prototype function
    // for correct add/remove event listeners
    this._eventHandlerShim = function (e) {
      _this._eventHandler(e);
    };

    this._bindEvents();

    if (beforeInit && typeof beforeInit === 'function') {
      beforeInit(this);
    }

    this._initState();

    this.elem._tabit = this;

    if (onInit && typeof onInit === 'function') {
      onInit(this);
    }

    return this.elem._tabit;
  }

  _createClass(Tabit, [{
    key: 'setActive',
    value: function setActive(tab) {
      var newTab = void 0;
      if (typeof tab === 'number') {
        newTab = this.tabs[tab];
      } else if (this.tabs.indexOf(tab) !== -1) {
        newTab = tab;
      }

      if (newTab) {
        this._runTabEvent(null, newTab);
      }
    }
  }, {
    key: 'getActive',
    value: function getActive() {
      return this.activeTab;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      var onDestroy = this.settings.onDestroy;
      this._unbindEvents();

      var btnActiveClass = this.settings.btnActiveClass;
      var contentActiveClass = this.settings.contentActiveClass;
      var toggleDisplay = this.settings.toggleDisplay;

      this.tabs.forEach(function (tab) {
        if (btnActiveClass) {
          // eslint-disable-next-line no-param-reassign
          tab.btnNode.classList.remove(btnActiveClass);
        }
        if (contentActiveClass) {
          // eslint-disable-next-line no-param-reassign
          tab.contentNode.classList.remove(contentActiveClass);
        }
        if (toggleDisplay) {
          // eslint-disable-next-line no-param-reassign
          tab.contentNode.style.display = '';
        }
      });

      delete this.elem._tabit;

      var props = Object.keys(this);
      props.forEach(function (prop) {
        delete _this2[prop];
      });

      if (onDestroy && typeof onDestroy === 'function') {
        onDestroy();
      }
    }
  }, {
    key: 'next',
    value: function next() {
      this._paginate();
    }
  }, {
    key: 'prev',
    value: function prev() {
      this._paginate(true);
    }
  }, {
    key: '_checkSettings',
    value: function _checkSettings() {
      var _this3 = this;

      // TODO:

      // CSS selectors
      // this.settings.btnSelector
      // this.settings.contentSelector

      // Strings without spaces
      // this.settings.btnActiveClass
      // this.settings.contentActiveClass

      // String or array
      // this.settings.event

      // Number, index must be exist
      // this.settings.active

      // Functions
      ['beforeInit', 'onInit', 'beforeChange', 'onChange', 'onDestroy'].forEach(function (func) {
        if (_this3.settings[func] && typeof _this3.settings[func] !== 'function') {
          throw new TypeError('`' + func + '` parameter must be a function.');
        }
      });
    }
  }, {
    key: '_eventHandler',
    value: function _eventHandler(event) {
      var tabs = this.tabs;
      var target = event.target;
      var btn = void 0;
      while (target !== this.elem && !btn) {
        if (matches(target, this.settings.btnSelector)) {
          for (var i = 0, c = tabs.length; i < c; i += 1) {
            if (target === tabs[i].btnNode) {
              btn = tabs[i];
              break;
            }
          }
        }
        target = target.parentNode;
      }

      if (btn) {
        return this._runTabEvent(event, btn);
      }

      return null;
    }
  }, {
    key: '_runTabEvent',
    value: function _runTabEvent(event, tab) {
      if (!tab) return;
      if (event) event.preventDefault();

      var newTab = tab;
      var activeTab = this.activeTab;
      var before = this.settings.beforeChange;
      var after = this.settings.onChange;
      var closable = this.settings.closable;
      var secondEvent = newTab === activeTab;

      if (secondEvent && !closable) return; // Ignore event on active tab

      if (before && typeof before === 'function') {
        before(activeTab, newTab, this);
      }

      if (secondEvent && closable) {
        // Hide active tab when event fired on it if closable set to true
        this._hideTab(activeTab);
        this.activeTab = null;
      } else {
        this._hideTab(activeTab);
        this._showTab(newTab);
      }

      if (after && typeof after === 'function') {
        after(newTab, this);
      }
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      this._setEvents();
    }
  }, {
    key: '_unbindEvents',
    value: function _unbindEvents() {
      this._setEvents(true);
    }
  }, {
    key: '_setEvents',
    value: function _setEvents(remove) {
      var _this4 = this;

      var event = this.settings.event;
      var action = remove ? 'removeEventListener' : 'addEventListener';

      if (typeof event === 'string') {
        this.elem[action](event, this._eventHandlerShim);
      } else if (Array.isArray(event)) {
        event.forEach(function (item) {
          _this4.elem[action](item, _this4._eventHandlerShim);
        });
      }
    }
  }, {
    key: '_initState',
    value: function _initState() {
      var active = this.settings.active;

      // Hide all tabs exclude active if set toggle display
      if (this.settings.toggleDisplay) {
        this.tabs.forEach(function (tab, i) {
          if (i !== active) {
            // eslint-disable-next-line no-param-reassign
            tab.contentNode.style.display = 'none';
          }
        });
      }

      if (active >= 0) this._runTabEvent(null, this.tabs[active]);
    }
  }, {
    key: '_hideTab',
    value: function _hideTab(tab) {
      this._toggleTab(tab, true);
    }
  }, {
    key: '_showTab',
    value: function _showTab(tab) {
      this._toggleTab(tab);
    }
  }, {
    key: '_toggleTab',
    value: function _toggleTab(tab, hide) {
      if (!tab) return;
      var classAction = hide ? 'remove' : 'add';
      var btnActiveClass = this.settings.btnActiveClass;
      var contentActiveClass = this.settings.contentActiveClass;

      if (this.settings.toggleDisplay) {
        // eslint-disable-next-line no-param-reassign
        tab.contentNode.style.display = hide ? 'none' : '';
      }
      if (btnActiveClass) {
        // eslint-disable-next-line no-param-reassign
        tab.btnNode.classList[classAction](btnActiveClass);
      }
      if (contentActiveClass) {
        // eslint-disable-next-line no-param-reassign
        tab.contentNode.classList[classAction](contentActiveClass);
      }
      if (!hide) {
        this.activeTab = tab;
      }
    }
  }, {
    key: '_paginate',
    value: function _paginate(prev) {
      if (!this.activeTab) return;

      var activeIndex = this.tabs.indexOf(this.activeTab);
      var maxIndex = this.tabs.length - 1;
      var target = void 0;
      var reverse = void 0;
      var step = void 0;

      if (prev) {
        step = -1;
        reverse = activeIndex === 0;
      } else {
        step = 1;
        reverse = activeIndex === maxIndex;
      }

      if (reverse) {
        target = prev ? maxIndex : 0;
      } else {
        target = activeIndex + step;
      }

      this.setActive(target);
    }
  }]);

  return Tabit;
}();

if (typeof module !== 'undefined') {
  module.exports = Tabit;
}
