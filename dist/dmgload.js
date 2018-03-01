/*! dmgload - v1.0.1 - 2018-03-01
* https://github.com/MRLuowen/Dmgload#readme
* Copyright (c) 2018 ; Licensed  */


(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.dmgload = factory());
}(this, (function () { 'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// android 4.4以上才支持MutationObserver.
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

var defaultConfig = {
    selector: ".lazyload",
    offset: 50, //偏移量，在距离视口多远的时候就开始加载
    debounce_time: 30, //防抖时间，在该时间内时是不会重复触发了。
    throttle_time: 300, //节流时间，在超过该时间之后一定要触发的。
    default_img: 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAABFCAYAAAAB8xWyAAAACXBIWXMAAAsSAAALEgHS3X78AAAAJUlEQVRoge3BMQEAAADCoPVP7WMMoAAAAAAAAAAAAAAAAAAA4AY6fQABFpNNRwAAAABJRU5ErkJggg=='
};

function inVisible(dom, offset) {
    var pos = dom.getBoundingClientRect(); //距离视口左上角的距离 .innerHeight就是视口高度
    if (pos.top <= window.innerHeight + offset && pos.bottom + offset >= 0) return true;else return false;
}

function loadImage(config) {
    var doms = document.querySelectorAll(config.selector);
    // alert(doms.length);
    for (var i = 0; i < doms.length; i++) {
        var item = doms[i];
        // 首先是懒加载的图片对象
        if (item.tagName == "IMG" && item.hasAttribute("data-src")) {
            // 位置在可视范围
            if (inVisible(item, config.offset)) {
                item.src = item.getAttribute("data-src");
                //在下载发生错误的时候使用默认图片。
                item.onerror = function () {
                    item.src = config.defaut_img;
                };
                // 移除class，防止再次触发。
                item.className = item.className.replace(config.selector.slice(1), "");
            }
        }
    }
}

function throttle(func, config) {
    var timeout,
        startTime = new Date();

    return function () {
        var curTime = new Date();

        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= config.throttle_time) {
            func(config);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            timeout = setTimeout(function () {
                func(config);
            }, config.debounce_time);
        }
    };
}

var index = {
    lazyload: function lazyload() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var config = _extends({}, defaultConfig, options);
        // 在滑动的时候触发了该事件。
        var updateImg = throttle(loadImage, config);
        window.addEventListener('scroll', updateImg);
        document.body.addEventListener('touchmove', updateImg);

        // 在dom节点发送变化的时候也要触发。在4.4之后用mutationobserver;其他用的定时器来判断
        if (MutationObserver) {
            var Ob = new MutationObserver(updateImg);
            var Obconfig = { childList: true, subtree: true };
            Ob.observe(document.body, Obconfig);
        } else {
            // 使用定时器查看是否需要更新。
            setInterval(updateImg, config.throttle_time);
        }
        // 如果直出的页面本身就拥有了需要懒加载的文件，页面一开始也要执行一遍。
        updateImg();
    }
};

return index;

})));
