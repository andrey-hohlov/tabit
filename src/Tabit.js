class Tabit {

  /**
   * Instance constructor
   * @param element - dom element
   * @param options {object}
   * @returns {Tabit|*}
   */
  constructor(element, options = {}) {
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
    let {
      buttonSelector = 'a', // Selector for tab button
      contentSelector = 'div', // Selector for tab content block
      buttonAttribute = 'href', // Attribute for refer button to content
      contentAttribute = 'id', // Attribute for refer button to content
      buttonActiveClass = null, // Css class for active button
      contentActiveClass = null, // Css class for active content
      event = 'click', // Event for change tab: click, mouseover
      activeIndex = 0, // Active tab on init
      toggleDisplay = true, // Toggle display property for tabs
      closable = false, // Allow to close active tab when fire event on it
      beforeInit = null, // Callback after instance init
      onInit = null, // Callback after instance init
      beforeChange = null, // Callback before change active tab
      onChange = null, // Callback after active tab changed
      onDestroy = null, // Callback after instance destroyed
    } = options;
    /* eslint-enable prefer-const */

    this.settings = { buttonSelector, contentSelector, buttonAttribute, contentAttribute, buttonActiveClass, contentActiveClass, event, activeIndex, toggleDisplay, closable, beforeInit, onInit, beforeChange, onChange, onDestroy }; // eslint-disable-line max-len

    this._checkSettings();


    /**
     * Create tabs collection
     */

    this.element = element;
    this.tabs = [];
    this._activeTab = null;

    let buttons = this.element.querySelectorAll(this.settings.buttonSelector);
    buttons = Array.prototype.slice.call(buttons);
    let contents = this.element.querySelectorAll(this.settings.contentSelector);
    contents = Array.prototype.slice.call(contents);

    const findTabContent = (button) => {
      let attrValue = button.getAttribute(buttonAttribute);
      let content = false;

      if (!attrValue) return false;

      // Replace first `#` in href attribute
      if (buttonAttribute === 'href') {
        attrValue = attrValue.replace(/^#/g, '');
      }

      // Find content for this tab and remove it from list for more fast next search
      contents.some((item, i, arr) => {
        if (item.getAttribute(contentAttribute) === attrValue) {
          content = arr[i];
          arr.splice(i, 1);
          return content;
        }
        return false;
      });

      return content;
    };

    buttons.forEach((button) => {
      const content = findTabContent(button);
      if (content) {
        this.tabs.push({
          button,
          content,
        });
      }
    });


    /**
     * Init
     */

    // Run event handler if fired on button
    // It store in each new instance and link to prototype function
    // for correct add/remove event listeners
    this._eventHandlerShim = (e) => { this._eventHandler(e); };

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
  setActiveTab(index) {
    const newTab = this.tabs[index];
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
  getActiveTab() {
    return this._activeTab;
  }

  /**
   * Return active tab index
   * @returns {number}
   */
  getActiveTabIndex() {
    return this.tabs.indexOf(this._activeTab);
  }

  /**
   * Return tab by index
   * @param index {number}
   */
  getTab(index) {
    return this.tabs[index];
  }

  /**
   * Go to next tab or return to first
   */
  next() {
    this._paginate();
  }

  /**
   * Go to previous tab or return to last
   */
  prev() {
    this._paginate(true);
  }

  destroy() {
    const onDestroy = this.settings.onDestroy;
    this._unbindEvents();

    const buttonActiveClass = this.settings.buttonActiveClass;
    const contentActiveClass = this.settings.contentActiveClass;
    const toggleDisplay = this.settings.toggleDisplay;

    this.tabs.forEach((tab) => {
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

    const props = Object.keys(this);
    props.forEach((prop) => {
      delete this[prop];
    });

    if (onDestroy && typeof onDestroy === 'function') {
      onDestroy();
    }
  }

  _checkSettings() {
    // TODO: check all settings

    // Functions
    ['beforeInit', 'onInit', 'beforeChange', 'onChange', 'onDestroy'].forEach((func) => {
      if (this.settings[func] && typeof this.settings[func] !== 'function') {
        throw new TypeError(`\`${func}\` parameter must be a function.`);
      }
    });
  }

  _eventHandler(event) {
    const tabs = this.tabs;
    let target = event.target;
    let tab;
    while (target !== this.element && !tab) {
      if (Tabit._domMatches(target, this.settings.buttonSelector)) {
        for (let i = 0, c = tabs.length; i < c; i += 1) {
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

  _runTabEvent(event, tab) {
    if (!tab) return;
    if (event) event.preventDefault();

    const newTab = tab;
    const activeTab = this._activeTab;
    const before = this.settings.beforeChange;
    const after = this.settings.onChange;
    const closable = this.settings.closable;
    const secondEvent = newTab === activeTab;

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

  _bindEvents() {
    this._setEvents();
  }

  _unbindEvents() {
    this._setEvents(true);
  }

  _setEvents(remove) {
    const event = this.settings.event;
    const action = remove ? 'removeEventListener' : 'addEventListener';

    if (typeof event === 'string') {
      this.element[action](event, this._eventHandlerShim);
    } else if (Array.isArray(event)) {
      event.forEach((item) => {
        this.element[action](item, this._eventHandlerShim);
      });
    }
  }

  _initState() {
    const activeIndex = this.settings.activeIndex;

    // Hide all tabs exclude active if set toggle display
    if (this.settings.toggleDisplay) {
      this.tabs.forEach((tab, i) => {
        if (i !== activeIndex) {
          // eslint-disable-next-line no-param-reassign
          tab.content.style.display = 'none';
        }
      });
    }

    if (activeIndex >= 0) this._runTabEvent(null, this.tabs[activeIndex]);
  }

  _hideTab(tab) {
    this._toggleTab(tab, true);
  }

  _showTab(tab) {
    this._toggleTab(tab);
  }

  _toggleTab(tab, hide) {
    if (!tab) return;
    const classAction = hide ? 'remove' : 'add';
    const buttonActiveClass = this.settings.buttonActiveClass;
    const contentActiveClass = this.settings.contentActiveClass;

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

  _paginate(prev) {
    if (!this._activeTab) return;

    const activeIndex = this.tabs.indexOf(this._activeTab);
    const maxIndex = this.tabs.length - 1;
    let target;
    let reverse;
    let step;

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
  static _domMatches(elem, selector) {
    /* eslint-disable */
    // Vendor-specific implementations of `Element.prototype.matches()`.
    const proto = window.Element.prototype;
    const nativeMatches = proto.matches ||
      proto.mozMatchesSelector ||
      proto.msMatchesSelector ||
      proto.oMatchesSelector ||
      proto.webkitMatchesSelector;

    if (!elem || elem.nodeType !== 1) {
      return false;
    }

    const parentElem = elem.parentNode;

    // use native 'matches'
    if (nativeMatches) {
      return nativeMatches.call(elem, selector);
    }

    // native support for `matches` is missing and a fallback is required
    const nodes = parentElem.querySelectorAll(selector);
    const len = nodes.length;

    for (let i = 0; i < len; i++) {
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
  static _isDom(val) {
    /* eslint-disable */
    return (!val || typeof val !== 'object')
      ? false
      : (typeof window === 'object' && typeof window.Node === 'object')
      ? (val instanceof window.Node)
      : (typeof val.nodeType === 'number') &&
    (typeof val.nodeName === 'string')
    /* eslint-enable */
  }
}

if (typeof module !== 'undefined') {
  module.exports = Tabit;
}
