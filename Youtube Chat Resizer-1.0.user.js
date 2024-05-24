// ==UserScript==
// @name         Youtube Chat Resizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Youtube Chat Resizer
// @author       Mofu
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Global variables
    const desktopMinWidth = 1000, emptySpaces = 105;

    // Helper functions
    let timer = null;
    const debounce = (fn, delay = 100) => {
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => { fn(...args); }, delay);
        }
    }

    // Core Logic
    const onResizeChange = () => {
        let frameStyle = ``;
        if (window.outerWidth < desktopMinWidth) {
            const videoPlayerHeight = (window.outerWidth - 48) / 16 * 9;
            frameStyle = `min-height: 0; max-height: ${window.outerHeight - (emptySpaces + videoPlayerHeight)}px;`
        }
        const targetEl = document.querySelector('ytd-live-chat-frame');
        if (targetEl) targetEl.style = frameStyle;
    }
    window.addEventListener('resize', debounce(onResizeChange));

    const onLoad = () => {
        setTimeout(() => {
            const targetEl = document.querySelector('ytd-live-chat-frame');
            if (typeof targetEl == 'object' && targetEl !== null) {
                onResizeChange();
            }
        }, 2500);
    }

    // Element Checking for first time
    document.onload = onLoad;
    onLoad();
})();
