# Dmgload

> Highly performant, light and configurable lazy loader in pure JS with no otherdependencies for H5.

## Features
- lazy loads elements performantly using pure JavaScript
- high performant and very small size ( Bundle size: 1.47 KB, Gzipped size: 873 B )
- design for mobile phone, can be used in android 2.3 and higher
- solve ios scroll event only trigger at the ending
- the most useful Feature, it support lazy-load Doms which is dynamic add to the document,you don't need call any other API。

[中文](https://github.com/MRLuowen/Dmgload/blob/master/README_CN.md)

## Install

```sh
# You can install dmgload with npm
$ npm install --save dmgload
```

## Usage
Then with a module bundler like rollup or webpack, use as you would anything else:

```javascript
// using ES6 modules
import dmgload from 'dmgload';
dmgload.lazyload();

// using CommonJS modules
var dmgload = require('dmgload');
dmgload.lazyload();
```
```html
<script type="text/javascript" src="/dist/dmgload.min.js"></script>
<script type="text/javascript"> dmgload.lazyload();</script>
```
In HTML, add an identifier to the element (default selector identified is `lazyload` class):
```html
<img class="lazyload" data-src="image.png" />
```

## Desc and Reference
you can also set some options to controll the actions
```javascript
import dmgload from 'Dmgload';
dmgload.lazyload{
    selector: ".lazyload",
    offset: 50,  //偏移量，在距离视口多远的时候就开始加载
    debounce_time: 30, //防抖时间，在该时间内时是不会重复触发了。
    throttle_time: 300,  //节流时间，在超过该时间之后一定要触发的。
    default_img: 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAABFCAYAAAAB8xWyAAAACXBIWXMAAAsSAAALEgHS3X78AAAAJUlEQVRoge3BMQEAAADCoPVP7WMMoAAAAAAAAAAAAAAAAAAA4AY6fQABFpNNRwAAAABJRU5ErkJggg==' // 在图片失效的时候使用的默认替代图片
};
```

