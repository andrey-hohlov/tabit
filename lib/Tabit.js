'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tabit = function () {

  /**
   * Instance constructor
   * @param element - dom element
   * @param options {object}
   * @returns {Tabit|*}
   */
  function Tabit(element) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Tabit);

    if (!Tabit._isDom(element)) {
      throw new TypeError('`new Tabit` requires a DOM element as its first argument.');
    }

    // Destroy if already initialized on this element
    if (element._tabit) {
      element._tabit.destroy();
    }

    // Tricky merge
    // https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20&%20beyond/ch2.md#nested-defaults-destructured-and-restructured
    /* eslint-disable prefer-const */
    var _options$buttonSelect = options.buttonSelector,
        buttonSelector = _options$buttonSelect === undefined ? 'a' : _options$buttonSelect,
        _options$contentSelec = options.contentSelector,
        contentSelector = _options$contentSelec === undefined ? 'div' : _options$contentSelec,
        _options$buttonAttrib = options.buttonAttribute,
        buttonAttribute = _options$buttonAttrib === undefined ? 'href' : _options$buttonAttrib,
        _options$contentAttri = options.contentAttribute,
        contentAttribute = _options$contentAttri === undefined ? 'id' : _options$contentAttri,
        _options$buttonActive = options.buttonActiveClass,
        buttonActiveClass = _options$buttonActive === undefined ? null : _options$buttonActive,
        _options$contentActiv = options.contentActiveClass,
        contentActiveClass = _options$contentActiv === undefined ? null : _options$contentActiv,
        _options$event = options.event,
        event = _options$event === undefined ? 'click' : _options$event,
        _options$activeIndex = options.activeIndex,
        activeIndex = _options$activeIndex === undefined ? 0 : _options$activeIndex,
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

    this.settings = { buttonSelector: buttonSelector, contentSelector: contentSelector, buttonAttribute: buttonAttribute, contentAttribute: contentAttribute, buttonActiveClass: buttonActiveClass, contentActiveClass: contentActiveClass, event: event, activeIndex: activeIndex, toggleDisplay: toggleDisplay, closable: closable, beforeInit: beforeInit, onInit: onInit, beforeChange: beforeChange, onChange: onChange, onDestroy: onDestroy }; // eslint-disable-line max-len

    this._checkSettings();

    /**
     * Create tabs collection
     */

    this.element = element;
    this.tabs = [];
    this._activeTab = null;

    var buttons = this.element.querySelectorAll(this.settings.buttonSelector);
    buttons = Array.prototype.slice.call(buttons);
    var contents = this.element.querySelectorAll(this.settings.contentSelector);
    contents = Array.prototype.slice.call(contents);

    var findTabContent = function findTabContent(button) {
      var attrValue = button.getAttribute(buttonAttribute);
      var content = false;

      if (!attrValue) return false;

      // Replace first `#` in href attribute
      if (buttonAttribute === 'href') {
        attrValue = attrValue.replace(/^#/g, '');
      }

      // Find content for this tab and remove it from list for more fast next search
      contents.some(function (item, i, arr) {
        if (item.getAttribute(contentAttribute) === attrValue) {
          content = arr[i];
          arr.splice(i, 1);
          return content;
        }
        return false;
      });

      return content;
    };

    buttons.forEach(function (button) {
      var content = findTabContent(button);
      if (content) {
        _this.tabs.push({
          button: button,
          content: content
        });
      }
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
      beforeInit.call(this, this);
    }

    this._initState();

    this.element._tabit = this;

    if (onInit && typeof onInit === 'function') {
      onInit.call(this, this);
    }

    return this.element._tabit;
  }

  /**
   * Set active tab by index
   * @param index {number}
   */


  _createClass(Tabit, [{
    key: 'setActiveTab',
    value: function setActiveTab(index) {
      var newTab = this.tabs[index];
      if (newTab) {
        this._runTabEvent(null, newTab);
        return true;
      }
      return false;
    }

    /**
     * Return active tab
     * @returns {null|object}
     */

  }, {
    key: 'getActiveTab',
    value: function getActiveTab() {
      return this._activeTab;
    }

    /**
     * Return active tab index
     * @returns {number}
     */

  }, {
    key: 'getActiveTabIndex',
    value: function getActiveTabIndex() {
      return this.tabs.indexOf(this._activeTab);
    }

    /**
     * Return tab by index
     * @param index {number}
     */

  }, {
    key: 'getTab',
    value: function getTab(index) {
      return this.tabs[index];
    }

    /**
     * Go to next tab or return to first
     */

  }, {
    key: 'next',
    value: function next() {
      this._paginate();
    }

    /**
     * Go to previous tab or return to last
     */

  }, {
    key: 'prev',
    value: function prev() {
      this._paginate(true);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      var onDestroy = this.settings.onDestroy;
      this._unbindEvents();

      var buttonActiveClass = this.settings.buttonActiveClass;
      var contentActiveClass = this.settings.contentActiveClass;
      var toggleDisplay = this.settings.toggleDisplay;

      this.tabs.forEach(function (tab) {
        if (buttonActiveClass) {
          // eslint-disable-next-line no-param-reassign
          tab.button.classList.remove(buttonActiveClass);
        }
        if (contentActiveClass) {
          // eslint-disable-next-line no-param-reassign
          tab.content.classList.remove(contentActiveClass);
        }
        if (toggleDisplay) {
          // eslint-disable-next-line no-param-reassign
          tab.content.style.display = '';
        }
      });

      delete this.element._tabit;

      var props = Object.keys(this);
      props.forEach(function (prop) {
        delete _this2[prop];
      });

      if (onDestroy && typeof onDestroy === 'function') {
        onDestroy();
      }
    }
  }, {
    key: '_checkSettings',
    value: function _checkSettings() {
      var _this3 = this;

      // TODO: check all settings

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
      var tab = void 0;
      while (target !== this.element && !tab) {
        if (Tabit._domMatches(target, this.settings.buttonSelector)) {
          for (var i = 0, c = tabs.length; i < c; i += 1) {
            if (target === tabs[i].button) {
              tab = tabs[i];
              break;
            }
          }
        }
        target = target.parentNode;
      }

      return tab ? this._runTabEvent(event, tab) : null;
    }
  }, {
    key: '_runTabEvent',
    value: function _runTabEvent(event, tab) {
      if (!tab) return;
      if (event) event.preventDefault();

      var newTab = tab;
      var activeTab = this._activeTab;
      var before = this.settings.beforeChange;
      var after = this.settings.onChange;
      var closable = this.settings.closable;
      var secondEvent = newTab === activeTab;

      if (secondEvent && !closable) return; // Ignore event on active tab

      if (before && typeof before === 'function') {
        before.call(this, activeTab, newTab, this);
      }

      if (secondEvent && closable) {
        // Hide active tab when event fired on it if closable set to true
        this._hideTab(activeTab);
        this._activeTab = null;
      } else {
        this._hideTab(activeTab);
        this._showTab(newTab);
      }

      if (after && typeof after === 'function') {
        after.call(this, newTab, this);
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
        this.element[action](event, this._eventHandlerShim);
      } else if (Array.isArray(event)) {
        event.forEach(function (item) {
          _this4.element[action](item, _this4._eventHandlerShim);
        });
      }
    }
  }, {
    key: '_initState',
    value: function _initState() {
      var activeIndex = this.settings.activeIndex;

      // Hide all tabs exclude active if set toggle display
      if (this.settings.toggleDisplay) {
        this.tabs.forEach(function (tab, i) {
          if (i !== activeIndex) {
            // eslint-disable-next-line no-param-reassign
            tab.content.style.display = 'none';
          }
        });
      }

      if (activeIndex >= 0) this._runTabEvent(null, this.tabs[activeIndex]);
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
      var buttonActiveClass = this.settings.buttonActiveClass;
      var contentActiveClass = this.settings.contentActiveClass;

      if (this.settings.toggleDisplay) {
        // eslint-disable-next-line no-param-reassign
        tab.content.style.display = hide ? 'none' : '';
      }
      if (buttonActiveClass) {
        // eslint-disable-next-line no-param-reassign
        tab.button.classList[classAction](buttonActiveClass);
      }
      if (contentActiveClass) {
        // eslint-disable-next-line no-param-reassign
        tab.content.classList[classAction](contentActiveClass);
      }
      if (!hide) {
        this._activeTab = tab;
      }
    }
  }, {
    key: '_paginate',
    value: function _paginate(prev) {
      if (!this._activeTab) return;

      var activeIndex = this.tabs.indexOf(this._activeTab);
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

      this.setActiveTab(target);
    }

    /**
     * Check if a DOM element matches a given selector
     * https://github.com/necolas/dom-matches
     * @param elem
     * @param selector
     * @returns {*}
     * @private
     */

  }], [{
    key: '_domMatches',
    value: function _domMatches(elem, selector) {
      /* eslint-disable */
      // Vendor-specific implementations of `Element.prototype.matches()`.
      var proto = window.Element.prototype;
      var nativeMatches = proto.matches || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;

      if (!elem || elem.nodeType !== 1) {
        return false;
      }

      var parentElem = elem.parentNode;

      // use native 'matches'
      if (nativeMatches) {
        return nativeMatches.call(elem, selector);
      }

      // native support for `matches` is missing and a fallback is required
      var nodes = parentElem.querySelectorAll(selector);
      var len = nodes.length;

      for (var i = 0; i < len; i++) {
        if (nodes[i] === elem) {
          return true;
        }
      }

      return false;
      /* eslint-enable */
    }

    /**
     * Check if the given object is a dom node
     * https://github.com/npm-dom/is-dom
     * @param val
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_isDom',
    value: function _isDom(val) {
      /* eslint-disable */
      return !val || (typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object' ? false : (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && _typeof(window.Node) === 'object' ? val instanceof window.Node : typeof val.nodeType === 'number' && typeof val.nodeName === 'string';
      /* eslint-enable */
    }
  }]);

  return Tabit;
}();

if (typeof module !== 'undefined') {
  module.exports = Tabit;
}
