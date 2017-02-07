# Tabit! [![Build Status](https://travis-ci.org/andrey-hohlov/tabit.svg?branch=master)](https://travis-ci.org/andrey-hohlov/tabit)

Just javascript tabs. Use it anywhere. No dependencies. Lightweight. Customizable. 

Examples: [http://andrey-hohlov.github.io/tabit/](https://andrey-hohlov.github.io/tabit/)

## Install 

### Download using NPM

```
$ npm install tabit --save
```

### Prepare HTML

```html
<div id="tabs">
  <nav>
    <a href="#tab-1">Tab 1</a>
    <a href="#tab-2">Tab 2</a>
    <a href="#tab-3">Tab 3</a>
  </nav>
  <div id="tab-1">Content of first tab</div>
  <div id="tab-2">Content of second tab</div>
  <div id="tab-3">Content of third tab</div>
</div>
```

### Import and call

```javascript

import Tabit from 'Tabit'

const element = document.getElementById('tabs');
const options = {};
const tabit = new Tabit(element, options); 
```

...or manually [download](https://github.com/andrey-hohlov/tabit/releases) and inject the minified script into your website.

## Options

```javascript
{
  buttonSelector = 'a',
  contentSelector = 'div',
  buttonAttribute = 'href',
  contentAttribute = 'id', 
  buttonActiveClass = null,
  contentActiveClass = null,
  event = 'click',
  activeIndex = 0,
  toggleDisplay = true, 
  closable = false,
  beforeInit = null,
  onInit = null,
  beforeChange = null,
  onChange = null, 
  onDestroy = null
}
```

- `buttonSelector` - *(string)* CSS selector for tab button - trigger for change tab
- `contentSelector` - *(string)* CSS selector for tab content block
- `buttonAttribute` - *(string)* attribute that contains a reference to the value of the `contentAttribute`, for `href` attribute will be removed first `#`
- `contentAttribute` - *(string)* attribute contains the value that is referred to by `buttonAttribute`
- `buttonActiveClass` - *(string)* class for active tab button
- `contentActiveClass` - *(string)* class for active tab content block
- `event` - *(string | array)* event or events fired on tab button, support: `click`, `mouseover`, `touchstart`
- `activeIndex` - *(number)* index of active tab on init, set `-1` for no active tab 
- `toggleDisplay` - *(boolean)* toggle css display property for tabs content blocks (display: none for inactive)
- `closable` - *(boolean)* close active tab after click
- `beforeInit` - *(function)* callback when instance created but not set active tab yet, arguments: `Tabit instance`
- `onInit` - *(function)* callback after successfully init, arguments: `Tabit instance`
- `beforeChange` - *(function)* callback before tab changed, arguments: `current active tab`, `new tab`, `Tabit instance` 
- `onChange` - *(function)* callback after tab changed, arguments: `new active tab`, `Tabit instance`
- `onDestroy` - *(function)* callback after instance destroyed

## API

- `next()` - go to next tab, turn to first from last
- `prev()` - go to previous tab, turn to last from first
- `getActiveTab()` - return active tab
- `getActiveTabIndex()` - return active tab index
- `getTab(index)` - get tab by index
- `setActiveTab(index)` - set active tab by index
- `destroy()` - destroy Tabit instance
- `getInstance(element)` - get Tabit instance from element

## Browser support
- IE 10+
- Chrome 24+
- Firefox 23+
- Opera 15+
- Safari 7+
- Android Browser 4.4+
- iOS Safari 7.1+

Works in IE 9 with [Element.prototype.classList](https://developer.mozilla.org/ru/docs/Web/API/Element/classList) polyfill.

Find polyfills on [polyfill.io](https://polyfill.io).

## Recipes

### Custom HTML structure

```html
<divid="tabs">
  <div>
    <button type="button" data-target="tab-1">Tab 1</button>
    <button type="button" data-target="tab-2">Tab 2</button>
    <button type="button" data-target="tab-3">Tab 3</button>
  </div>
  <div>
    <div data-content="tab-1">Content of first tab</div>
    <div data-content="tab-2">Content of second tab</div>
    <div data-content="tab-3">Content of third tab</div>
  </div>
</div>
```

```javascript
new Tabit(
  document.getElementById('tabs'),
  {
    buttonSelector: '[data-target]',
    contentSelector: 'data-target',
    buttonAttribute: '[data-content]',
    contentAttribute: 'data-content',  
  }
);
```

### Only change CSS class

```javascript
new Tabit(
  document.getElementById('tabs'),
  {
    contentActiveClass: 'is-active',
    toggleDisplay: false
  }
);
```

```css
div:not(.is-active) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

```

### Change on hover

```javascript
new Tabit(
  document.getElementById('tabs'),
  {
    event: ['mouseover', 'click']
  }
);
```

### Use custom animations

```javascript
new Tabit(
  document.getElementById('tabs'),
  {
    toggleDisplay: false,
    onInit: function (instance) {
      this.tabs.forEach(function (item, i) {
        if (i !== 0) $(item.content).hide();
      });
    },
    beforeChange: function (activeTab, newTab, instance) {
      if (!activeTab) return; // no animate on init
      $(activeTab.content)
        .stop()
        .fadeOut(function () {
          $(newTab.content).stop().fadeIn()
        });
    }
  }
);
```

### Auto rotation

```javascript
var tabit = new Tabit(document.getElementById('tabs'));
var rotate = setInterval(function() {
  tabit.next();      
}, 2000)
```

[Live examples](https://andrey-hohlov.github.io/tabit/)


## Changelog

#### 2.2
- Add instance cache
- Add `getInstance` method

#### 2.1
- Refactoring after code review
- [Change options names](https://github.com/andrey-hohlov/tabit/commit/71736aba1df63953525fbbe65b628c8f1647a6c0)


#### 2.0
- Full rewrite on ES6.



## License

The [MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Andrey Hohlov
