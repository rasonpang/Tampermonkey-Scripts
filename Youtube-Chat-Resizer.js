// ==UserScript==
// @name         Youtube Chat Resizer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Youtube Chat Resizer
// @author       Mofu
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://github.com/rasonpang/Tampermonkey-Better-Youtube/raw/main/Youtube-Chat-Resizer.js
// @downloadURL  https://github.com/rasonpang/Tampermonkey-Better-Youtube/raw/main/Youtube-Chat-Resizer.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // GLOB VARS
    const querySelectors = {
        chat: 'ytd-live-chat-frame',
        header: '#masthead-container',
        page_manager: 'ytd-page-manager',
    };
    const desktopMinWidth = 1000,
        headerHeight = 56,
        emptySpaces = 105;
    const css = `
        ${querySelectors.page_manager} {
            margin-top: 0 !important;
        }
        ${querySelectors.header} {
            background: var(--yt-spec-base-background);
            transform: translateY(-${headerHeight - 10}px) !important;
            border-bottom: .3rem solid var(--yt-spec-10-percent-layer);
        }

        ${querySelectors.header}:hover {
            transform: translateY(0) !important;
        }
    `;

    // HELPERS
    let timer = null;
    function debounce(fn, delay = 100) {
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => { fn(...args); }, delay);
        }
    }

    // EVENT LISTENER
    function injectCSS() {
        const styleEl = document.createElement('style');
        styleEl.id = 'YT-Chat-Resizer';
        styleEl.innerHTML = css;

        document.head.prepend(styleEl);
    }

    function onResizeChange() {
        let frameStyle = ``;
        if (window.outerWidth < desktopMinWidth) {
            const videoPlayerHeight = (window.outerWidth - 48) / 16 * 9;
            
            const maxHeight = window.outerHeight - (emptySpaces - headerHeight + videoPlayerHeight);
            const height = maxHeight - 24;

            frameStyle = `min-height: 0; max-height: ${maxHeight}px; height: ${height}px;`
        }
        const targetEl = document.querySelector(querySelectors.chat);
        if (targetEl) targetEl.style = frameStyle;
    }
    
    // ON DOCUMENT LOAD
    function onLoad() {
        // Inject CSS
        injectCSS();

        // Live Chat
        setTimeout(() => {
            const targetEl = document.querySelector(querySelectors.chat);
            if (typeof targetEl == 'object' && targetEl !== null) {
                onResizeChange();
            }
        }, 2500);
    }

    // EXECUTION
    window.addEventListener('resize', debounce(onResizeChange));
    document.onload = onLoad;
    onLoad();
})();
