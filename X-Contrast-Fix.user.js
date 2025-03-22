// ==UserScript==
// @name        X - Fix High Contrast Eye Pain
// @namespace   Violentmonkey Scripts
// @version     1.0
// @description Fix high contrast eye pain
// @author      Mofu
// @match       https://x.com/*
// @icon        https://abs.twimg.com/favicons/twitter.3.ico
// @updateURL   none
// @downloadURL none
// @grant       none
// ==/UserScript==

function setStyle(classList) {
    const color = '#191919';

    const customStyle = document.createElement('style');
    customStyle.id = 'custom-style';

    const content = `html { --primary-color: ${color}; } ` + classList.map(i => `.${i} { background-color: var(--primary-color) !important; }`).join(' ');
    customStyle.innerHTML = content;

    document.querySelector('head').prepend(customStyle);
    document.querySelector("body").style = `background-color: var(--primary-color);`;
}

function scanClassName(classList) {
    const elementId = 'test-el';
    let result = [];

    classList.forEach(i => {
        const testEl = document.createElement('div');
        testEl.id = elementId;
        document.querySelector('body').prepend(testEl);
        document.querySelector(`#${elementId}`).className = document.querySelector(`#${elementId}`).className + i + ' ';
        if (getComputedStyle(document.querySelector(`#${elementId}`)).backgroundColor !== 'rgba(0, 0, 0, 0)') {
            result.push(i);
            document.querySelector('body').removeChild(testEl);
            return;
        }
        document.querySelector('body').removeChild(testEl);
    });

    return result;
}

function execute(elements) {
    const classList = elements.filter(i => i !== undefined).map(i => [...i.classList]).flat();
    const targetClassList = scanClassName(classList);
    setStyle(targetClassList);
}

setTimeout(() => {
  execute([
    document.querySelector("div[data-testid='primaryColumn']"),
    document.querySelector("div[aria-label='Home timeline']")?.children[0]?.children[0],
    document.querySelector("div[aria-label='Grok']")?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.children[0],
  ]);
}, 1000);