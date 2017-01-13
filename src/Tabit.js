const isDom = require('is-dom');
const matches = require('dom-matches');

class Tabit {
  constructor(elem, options = {}) {
    if (!isDom(elem)) {
      throw new TypeError('`new Tabit` requires a DOM element as its first argument.');
    }

    // Destroy if already initialized on this element
    if (elem._tabit) {
      elem._tabit.destroy();
    }


    /**
     * Merge options
     * https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20&%20beyond/ch2.md#nested-defaults-destructured-and-restructured
     */

    const {
      btnSelector = 'a', // Selector for tab button
      contentSelector = 'div', // Selector for tab content block
      btnAttr = 'href', // Attribute for refer button to content
      contentAttr = 'id', // Attribute for refer button to content
      btnActiveClass = null, // Css class for active button
      contentActiveClass = null, // Css class for active content
      event = 'click', // Event for change tab: click, mouseover
      active = 0, // Active tab on init
      toggleDisplay = true, // Toggle display property for tabs
      closable = false, // Allow to close active tab when fire event on it
      beforeInit = null, // Callback after instance init
      onInit = null, // Callback after instance init
      beforeChange = null, // Callback before change active tab
      onChange = null, // Callback after active tab changed
      onDestroy = null, // Callback after instance destroyed
    } = options;

    this.settings = { btnSelector, contentSelector, btnAttr, contentAttr, btnActiveClass, contentActiveClass, event, active, toggleDisplay, closable, beforeInit, onInit, beforeChange, onChange, onDestroy }; // eslint-disable-line max-len

    this._checkSettings();

    this.elem = elem;
    this.tabs = [];
    this.activeTab = null;


    /**
     * Create tabs collection
     */

    const btns = [...this.elem.querySelectorAll(this.settings.btnSelector)];
    const contents = [...this.elem.querySelectorAll(this.settings.contentSelector)];

    const findTabContent = (btn) => {
      let attrValue = btn.getAttribute(btnAttr);
      let content = false;

      if (!attrValue) return false;

      // Replace first `#` in href attribute
      if (btnAttr === 'href') {
        attrValue = attrValue.replace(/^#/g, '');
      }

      // Find content for this tab and remove it from list for more fast next search
      contents.some((item, i, arr) => {
        if (item.getAttribute(contentAttr) === attrValue) {
          content = arr[i];
          arr.splice(i, 1);
          return content;
        }
        return false;
      });

      return content;
    };

    btns.forEach((item) => {
      const btn = item;
      const content = findTabContent(item);
      if (!content) return;
      this.tabs.push({
        btnNode: btn,
        contentNode: content,
      });
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
      beforeInit(this);
    }

    this._initState();

    this.elem._tabit = this;

    if (onInit && typeof onInit === 'function') {
      onInit(this);
    }

    return this.elem._tabit;
  }

  setActive(tab) {
    let newTab;

    if (this.tabs.indexOf(tab) !== -1) {
      newTab = tab;
    } else if (this.tabs[parseInt(tab, 10)]) {
      newTab = this.tabs[parseInt(tab, 10)];
    }

    if (newTab) {
      this._runTabEvent(null, newTab);
    }
  }

  getActive() {
    return this.activeTab;
  }

  destroy() {
    const onDestroy = this.settings.onDestroy;
    this._unbindEvents();

    const btnActiveClass = this.settings.btnActiveClass;
    const contentActiveClass = this.settings.contentActiveClass;
    const toggleDisplay = this.settings.toggleDisplay;

    this.tabs.forEach((tab) => {
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

    const props = Object.keys(this);
    props.forEach((prop) => {
      delete this[prop];
    });

    if (onDestroy && typeof onDestroy === 'function') {
      onDestroy();
    }
  }

  next() {
    this._paginate();
  }

  prev() {
    this._paginate(true);
  }

  _checkSettings() {
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
    ['beforeInit', 'onInit', 'beforeChange', 'onChange', 'onDestroy'].forEach((func) => {
      if (this.settings[func] && typeof this.settings[func] !== 'function') {
        throw new TypeError(`\`${func}\` parameter must be a function.`);
      }
    });
  }

  _eventHandler(event) {
    const tabs = this.tabs;
    let target = event.target;
    let btn;
    while (target !== this.elem && !btn) {
      if (matches(target, this.settings.btnSelector)) {
        for (let i = 0, c = tabs.length; i < c; i += 1) {
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

  _runTabEvent(event, tab) {
    if (!tab) return;
    if (event) event.preventDefault();

    const newTab = tab;
    const activeTab = this.activeTab;
    const before = this.settings.beforeChange;
    const after = this.settings.onChange;
    const closable = this.settings.closable;
    const secondEvent = newTab === activeTab;

    if (secondEvent && !closable) return; // Ignore event on active tab

    if (before && typeof before === 'function') {
      before(activeTab, newTab);
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
      after(newTab);
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
      this.elem[action](event, this._eventHandlerShim);
    } else if (Array.isArray(event)) {
      event.forEach((item) => {
        this.elem[action](item, this._eventHandlerShim);
      });
    }
  }

  _initState() {
    const active = this.settings.active;

    // Hide all tabs exclude active if set toggle display
    if (this.settings.toggleDisplay) {
      this.tabs.forEach((tab, i) => {
        if (i !== active) {
          // eslint-disable-next-line no-param-reassign
          tab.contentNode.style.display = 'none';
        }
      });
    }

    if (active >= 0) this._runTabEvent(null, this.tabs[active]);
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
    const btnActiveClass = this.settings.btnActiveClass;
    const contentActiveClass = this.settings.contentActiveClass;

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

  _paginate(prev) {
    if (!this.activeTab) return;

    const activeIndex = this.tabs.indexOf(this.activeTab);
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

    this.setActive(target);
  }
}

if (typeof module !== 'undefined') {
  module.exports = Tabit;
}
