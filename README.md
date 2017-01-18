# Tabit! [![Build Status](https://travis-ci.org/andrey-hohlov/tabit.svg?branch=master)](https://travis-ci.org/andrey-hohlov/tabit)

Just javascript tabs. Make it where you want. No dependencies. Lightweight. Customizable. 

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
new Tabit(element, options);
```

...or manually [download](https://github.com/andrey-hohlov/tabit/releases) and inject the minified script into your website.

## Options

```javascript
{
  btnSelector = 'a',
  contentSelector = 'div',
  btnAttr = 'href',
  contentAttr = 'id', 
  btnActiveClass = null,
  contentActiveClass = null,
  event = 'click',
  active = 0,
  toggleDisplay = true, 
  closable = false,
  beforeInit = null,
  onInit = null,
  beforeChange = null,
  onChange = null, 
  onDestroy = null
}
```

- `btnSelector` - *(string)* CSS selector for tab button - trigger for change tab
- `contentSelector` - *(string)* CSS selector for tab content block
- `btnAttr` - *(string)* attribute that contains a reference to the value of the `contentAttr`, for `href` attribute will be removed first `#`
- `contentAttr` - *(string)* attribute contains the value that is referred to by `btnAttr`
- `btnActiveClass` - *(string)* class for active tab button
- `contentActiveClass` - *(string)* class for active tab content block
- `event` - *(string | array)* event or events fired on tab button, support: `click`, `mouseover`, `touchstart`
- `active` - *(number or boolean)* index of active tab on init, set `false` for no active tab 
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
- `getActive()` - return current active tab
- `setActive(index)` - set active tab by index
- `destroy()` - destroy Tabit instance

## Browser support
- IE10
- Chrome 12
- Firefox 16
- Opera 15
- Safari 4
- Android Browser 4.0
- iOS Safari 6.0

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
    btnSelector: '[data-target]',
    contentSelector: 'data-target',
    btnAttr: '[data-content]',
    contentAttr: 'data-content',  
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
    event: 'mouseover'
  }
);
```

### Use custom animations

[Example](http://andrey-hohlov.github.io/tabit/#tabs-animations)

```javascript
new Tabit(
  document.getElementById('tabs'),
  {
    active: 0,
    toggleDisplay: false,
    onInit: function (instance) {
      instance.tabs.forEach(function (item, i) {
        if (i !== 0) $(item.contentNode).hide();
      });
    },
    beforeChange: function (activeTab, newTab, instance) {
      if (!activeTab) return; // no animate on init
      $(activeTab.contentNode).animate({
        opacity: 'hide'
      }, 300, function () {
        $(newTab.contentNode).animate({
          opacity: 'show'
        }, 400)
      })
    }
  }
);
```

### Auto rotation

```javascript
var instance = new Tabit(document.getElementById('tabs'));
var rotate = setInterval(function() {
  instance.next();      
}, 2000)
```

[Live examples](https://andrey-hohlov.github.io/tabit/)

## License

The [MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Andrey Hohlov
