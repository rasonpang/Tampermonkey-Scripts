// ==UserScript==
// @name        X - Fix High Contrast Eye Pain
// @namespace   Violentmonkey Scripts
// @version     1.0
// @description Fix high contrast eye pain
// @author      Mofu
// @match       https://x.com/*
// @icon        https://abs.twimg.com/favicons/twitter.3.ico
// @updateURL   https://github.com/rasonpang/Tampermonkey-Scripts/raw/main/X-Contrast-Fix.user.js
// @downloadURL https://github.com/rasonpang/Tampermonkey-Scripts/raw/main/X-Contrast-Fix.user.js
// @grant       none
// ==/UserScript==

function setStyle(classList) {
    const color = '#191919';

    const customStyle = document.createElement('style');
    customStyle.id = 'custom-style';

    const content = `html { --primary-color: ${color}; } ` + classList.map(i => `.${i} { background-color: var(--primary-color) !important; }`).join(' ');
    customStyle.innerHTML = content;

    if ($('#custom-style')) $('head').removeChild($('#custom-style'));
    $('head').prepend(customStyle);
    $("body").style = `background-color: var(--primary-color);`;
}

// Scan className with 'background-color' in it
function scanClassName(classList) {
    const defaultBgColor = 'rgba(0, 0, 0, 0)';
    const elementId = 'test-el';
    let result = [];

    classList.forEach(i => {
        const testEl = document.createElement('div');
        testEl.id = elementId;
        $('body').prepend(testEl);
        $(`#${elementId}`).className = $(`#${elementId}`).className + i + ' ';
        if (getComputedStyle($(`#${elementId}`)).backgroundColor !== defaultBgColor) {
            result.push(i);
            $('body').removeChild(testEl);
            return;
        }
        $('body').removeChild(testEl);
    });

    return result;
}

function execute(elements) {
    const classList = elements.filter(i => i !== undefined).map(i => [...i.classList]).flat();
    const targetClassList = scanClassName(classList);
    setStyle(targetClassList);
}

// For grabbing element more easily
function $(querySelector, nested = 0) {
    let result = document.querySelector(querySelector);
    if ([undefined, null].includes(result)) return undefined;
    if (nested <= 0) return result;

    for (let i = 0; i < nested; i++) {
        if (!result) return undefined;
        result = result?.children[0];
    }
    return result;
}

function setup() {
    setTimeout(() => {
        const targets = [
            // Default
            $("div[data-testid='primaryColumn']"),
            $("div[aria-label='Home timeline']", 2),
    
            // Post
            $("div[aria-label='Grok']", 6),
            $("div[aria-label='Home timeline']", 6),
    
            // Chat
            $("section[aria-label='Section details']", 1),
            $("section[aria-label='Section navigation']", 6),
    
            // Job Page
            $("div[data-testid='GrokDrawer']", 1),
        ];
        
        if (targets[0] === undefined || targets[1] === undefined) return setup();
    
        return execute(targets);
    }, 100);
}

let previousUrl = '';
const observer = new MutationObserver(function(mutations) {
  if (location.href !== previousUrl) {
      previousUrl = location.href;
      setup();
    }
});
const config = {subtree: true, childList: true};
observer.observe(document, config);