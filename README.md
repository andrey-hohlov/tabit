# Tabit!
Just javascript tabs. Make it where you want. No dependencies. Lightweight. Customizable. 

Examples: [andrey-hohlov.github.io/tabit/](https://andrey-hohlov.github.io/tabit/)

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

- `btnSelector` - (string) CSS selector for tab button - trigger for change tab
- `contentSelector` - (string) CSS selector for tab content block
- `btnAttr` - (string) attribute !!!!!!!!!!!!!
- `contentAttr` - (string) attribute !!!!!!!!!!!!!
- `btnActiveClass` - (string) class for active tab button
- `contentActiveClass` - (string) class for active tab content block
- `event` - (string) !!!!!!!!!!!!!
- `active` - (number or boolean) index of active tab on init, set `false` for no active tab 
- `toggleDisplay` - (boolean) toggle css display property for tabs content blocks (display: none for inactive)
- `closable` - (boolean) close active tab after click
- `beforeInit` - (function) callback when instance created but not set active tab yet, arguments: `Tabit instance`
- `onInit` - (function) callback after successfully init, arguments: `Tabit instance`
- `beforeChange` - (function) callback before tab changed, arguments: `current active tab`, `new tab` 
- `onChange` - (function) callback after tab changed, arguments: `new active tab`
- `onDestroy` - (function) callback after instance destroyed

## API

- `next()` - (function) !!!!!!!!!!!!!
- `prev()` - (function) !!!!!!!!!!!!!
- `getActive()` - (function) !!!!!!!!!!!!!
- `setActive()` - (function) !!!!!!!!!!!!!
- `destroy()` - (function) !!!!!!!!!!!!!

## Browser support

## Recipes

### Use custom HTML structure

### Only change CSS classes

### Change on hover

### Use custom animations

### Auto rotation

## License

The [MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Andrey Hohlov
