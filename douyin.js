// ==UserScript==
// @name         快速搜索
// @namespace    http://tampermonkey.net/
// @version      2024-11-05
// @description  防止浏览无用信息
// @author       xueqi
// @match        https://www.douyin.com/*
// @icon         https://www.baidu.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    if (location.href.includes("search")) return
    var mySearch = prompt("你要搜索什么？")
    location.assign(`https://www.douyin.com/search/${mySearch}`)

})();