# Dmgload

> 一个使用纯javascript实现的、针对移动端h5页面、兼容性及性能非常优秀的图片懒加载插件，正在意义上的实现了通过js对动态添加的图片节点的懒加载。 

## Features
- 非常的高性能、且不依赖于任何第三方工具，完全解耦。
- 尺寸非常小( Bundle size: 1.47 KB, Gzipped size: 873 B )
- 转为移动端设计，兼容性非常好，支持iOS 8.0以及android 2.3及以上系统。针对iOS做了优化
- 对动态添加的元素节点也支持懒加载而不需要再次绑定事件，非常的高效。

## 安装

```sh
# You can install dmgload with npm
$ npm install --save dmgload
```

## 使用
支持多种方式使用，可以用模块的方式，也通过javscript文件直接应用。

```javascript
// using ES6 modules
import dmgload from 'Dmgload';
dmgload.lazyload();

// using CommonJS modules
var dmgload = require('dmgload');
dmgload.lazyload();
```

```html
<script type="text/javascript" src="/dist/dmgload.min.js"></script>
<script type="text/javascript"> dmgload.lazyload();</script>
```
在html里面，我们对拥有特定的className的img标签做懒加载，在他的data-src里面填充图片源。（默认className是 lazyload ）。
如果图片加载失败了，我们会使用默认的一张纯白色背景图替代。
```html
<img class="lazyload" data-src="image.png" />
```

## 描述和使用定制
你也可以通过自己的需求做一些定制，参数以及含义如下。
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

## 实现原理以及背景描述
- 背景：
 - 这个插件主要是我的开发业务场景中，有一个榜单的展示，榜单上很多的人物头像，如果不适用懒加载的方式，这些头像节点会阻塞其他比较重要的一些图片的下载。一开始是使用的zepto的lazyload，但是性能很低，实现不够优雅，存在的问题有：
  - 在iOS上，scroll的触发是在scroll事件结束之后才触发，也就是你的手指松开之后才去懒加载，那么如果用户长时间拖动列表，列表会出现大量的空白。这个插件使用了scroll+touchmove的兼容方案。
  - 头像节点是通过ajax获取到数据之后动态渲染出来的，如果是lazyload的话，还需要手动调用一遍$(".lazyload").lazyload()。但是我这边是使用vue开发的，头像被封装了成了一个组件，那么就需要在mounted的时候调用这个方法。那么就会导致这个列表的渲染会多次调用这个方法，以往已经绑定过的事件也还需要先off再on，无端的浪费了性能。
 - 也参考了github上的高star项目，lozad.js，它依赖于IntersectionObserver，这个移动端都没支持。而且市面上基本上大部分对动态添加的dom节点都需要手动在调用一次。


- 实现原理：
 - 不同于lazyload或者是lozad.js针对于每一个dom节点都绑定scroll事件。我们只对全局绑定事件，这样做的好处是规避了在每次动态的添加需要懒加载的dom元素的时候，都需要手动的绑定事件。减少了页面监听器数量，也让代码更加优雅高效。
 - 那么问题来了，如果在你页面动态添加了需要懒加载的dom节点的情况下，通知这个插件去懒加载图片呢。
  - 针对支持MutationOberver（ios 6.1，android 4.4）对象的设备，我们可以通过它来监听body的subtree的修改。（基本能涵盖98%以上的设备）
  - 不支持的设备，我们使用一个定时器来查询（默认300毫秒）。
 - 优化：
  - 所有触发事件都归一到了一个闭包函数中集中处理，使用了防抖和节流方式，防止频繁dom操作以及长时间不操作的问题，默认（30ms内最多执行一次懒加载，300ms内至少执行一次懒加载）。
  - 有预先设定的一部分距离，可以提前拉取。
  - 针对加载错误，图片资源找不到等，设置了默认图片。 
 - 缺点和不足：
  - 即便页面已经没有了需要懒加载的dom节点，这些事件也会继续被触发，但是成本比较低，只是一次选择器查询。查不到需要懒加载的dom节点就直接返回了。
  - 功能比较简单，市面上其他一些懒加载还支持响应式加载（根据viewport大小选择加载不同的图片),自定义触发函数，因为业务没这个需求也就没有使用。

