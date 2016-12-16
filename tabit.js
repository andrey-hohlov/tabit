/*!
 * Tab it! - just tabs. Make it where you want.
 * https://github.com/andrey-hohlov/tabit
 * @license MIT licensed
 */

;(function(global) {

  'use strict';

  function Tabit(elem, options) {

    this.defaults = {
      tabSelector: 'a',
      contentSelector: 'div',
      tabAttr: 'href',
      contentAttr: 'id',
      tabActiveClass: 'is-active',
      contentActiveClass: 'is-active',
      tabEvent: 'click',
      active: 1, // TODO: set index include zero
      toggleDisplay: true,
      closable: false
    };

    // Merge options with defaults
    this.options = this._extend({}, this.defaults, options);

    // Main wrapper
    this.elem = elem;

    // Tabs buttons
    this.tabsArr = this.elem.querySelectorAll(this.options.tabSelector); // TODO: error if empty
    this.contentArr = this.elem.querySelectorAll(this.options.contentSelector); // TODO: error if empty

    // Make array from node list
    this.tabsArr = Array.prototype.slice.call(this.tabsArr, 0);
    this.contentArr = Array.prototype.slice.call(this.contentArr, 0);

    // Wrapper for correct bind / unbind event
    var $tabit = this;
    this.eventHandlerWrap = function (event) {
      $tabit.eventHandler(this, event)
    };

    // Fix wrong options
    this.fixOptions();

    // Add event to tabs
    this.bindEvents();

    var activeTabIndex = parseInt(this.options.active) - 1;

    // Hide tabs content if needed
    if (this.options.toggleDisplay) {
      this.contentArr.forEach(function (item, i) {
        if (i !== activeTabIndex) {
          item.style.display = 'none';
        }
      })
    }

    // Make active first or custom tab
    if (activeTabIndex) {
      this._trigger(this.tabsArr[activeTabIndex], this.options.tabEvent);
    }
  }

  Tabit.prototype.eventHandler = function (tab, event) {
    event.preventDefault();

    var attr = this.options.tabAttr;
    var tabActiveClass = this.options.tabActiveClass;
    var contentActiveClass = this.options.contentActiveClass;
    var before = this.options.before;
    var after = this.options.after;


    if (this.options.closable && this._hasClass(tab, tabActiveClass)) {
      this.clearActiveTab();
      this.clearActiveContent();
      return;
    }

    if (this._hasClass(tab, tabActiveClass)) return;

    // Find content for tab
    var attrValue = tab.getAttribute(attr);
    var content;

    if (attr == 'href') {
      attrValue = attrValue.replace('#', '');
    }

    content = this.findContent(attrValue);

    if (before && typeof before === 'function') {
      before(tab, content);
    }

    // Remove classes from all tabs and content
    this.clearActiveTab();
    this.clearActiveContent();

    // Add active class for this tab and content
    this._addClass(tab, tabActiveClass);
    if (content) {
      this._addClass(content, contentActiveClass);
      if (this.options.toggleDisplay) content.style.display = 'block';
    }

    if (after && typeof after === 'function') {
      after(tab, content);
    }

  };

  Tabit.prototype.bindEvents = function () {
    var $tabit = this;

    this.tabsArr.forEach(function (item, i, arr) {

      item.addEventListener($tabit.options.tabEvent, $tabit.eventHandlerWrap);

    });

  };

  Tabit.prototype.unbindEvents = function () {
    var $tabit = this;

    $tabit.tabsArr.forEach(function (item, i, arr) {
      item.removeEventListener($tabit.options.tabEvent, $tabit.eventHandlerWrap);
    });

  };

  Tabit.prototype.clearActiveTab = function () {
    var $tabit = this;
    var className = $tabit.options.tabActiveClass;

    Array.prototype.some.call($tabit.tabsArr, function (item, i, arr) {

      if ($tabit._hasClass(item, className)) {
        $tabit._removeClass(item, className);
        return true;
      }

    });

  };

  Tabit.prototype.findContent = function (attrValue) {
    var $tabit = this;
    var attr = $tabit.options.contentAttr;
    var content = null;

    Array.prototype.some.call($tabit.contentArr, function (item, i, arr) {
      if (item.getAttribute(attr) == attrValue) {
        content = arr[i];
        return arr[i];
      }
    });

    return content;

  };

  Tabit.prototype.clearActiveContent = function () {

    var $tabit = this;
    var className = $tabit.options.contentActiveClass;

    Array.prototype.some.call($tabit.contentArr, function (item, i, arr) {

      if ($tabit._hasClass(item, className)) {
        $tabit._removeClass(item, className);
        if ($tabit.options.toggleDisplay) item.style.display = 'none';
        return true;
      }

    });

  };

  Tabit.prototype.destroy = function () {
    this.unbindEvents();
    this.clearActiveTab();
    this.clearActiveContent();
  };

  Tabit.prototype.fixOptions = function () {

    var activeIndex = this.options.active;
    var tabsLength = this.tabsArr.length;

    if (activeIndex > tabsLength) {
      this.options.active = 1;
    }

  };

  /**
   * Helpers
   */

  Tabit.prototype._extend = function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];

      if (!obj)
        continue;

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object')
            out[key] = this._extend(out[key], obj[key]);
          else
            out[key] = obj[key];
        }
      }
    }

    return out;
  };

  Tabit.prototype._removeClass = function (el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  };

  Tabit.prototype._addClass = function (el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  };

  Tabit.prototype._hasClass = function (el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  };

  Tabit.prototype._trigger = function (el, event) {
    var eventObj = document.createEvent('HTMLEvents');
    eventObj.initEvent(event, false, true);
    el.dispatchEvent(eventObj);
  };

  /**
   * Exports to multiple environments
   */

  if (typeof define === 'function' && define.amd) {
    define(function () { return Tabit; });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tabit;
  } else {
    global['Tabit'] = Tabit;
  }

})(this);
