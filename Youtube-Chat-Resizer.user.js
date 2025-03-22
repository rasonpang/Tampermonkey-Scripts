// ==UserScript==
// @name         Youtube Chat Resizer
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Youtube Chat Resizer
// @author       Mofu
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://github.com/rasonpang/Tampermonkey-Scripts/raw/main/Youtube-Chat-Resizer.user.js
// @downloadURL  https://github.com/rasonpang/Tampermonkey-Scripts/raw/main/Youtube-Chat-Resizer.user.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// GLOBAL VARIABLES
	const querySelectors = {
		css: "#YT-Chat-Resizer-Style",
		header: "#masthead-container",
		page_manager: "ytd-page-manager",

		chat_container:
			"ytd-watch-flexy[fixed-panels] #chat.ytd-watch-flexy",
		chat: "ytd-live-chat-frame",

		video_container: ".html5-video-player > iframe",
		video_thumbnail:
			".ytp-cued-thumbnail-overlay > .ytp-cued-thumbnail-overlay-image, .ytp-offline-slate > .ytp-offline-slate-background",
		video_original: ".html5-video-container > video",
	};

	const desktopMinWidth = 1000,
		headerHeight = 56,
		emptySpaces = 105;

	const css = `
    :root {
      --pad-top: 20px;
    }
      
    ${querySelectors.video_container} {
      top: var(--pad-top) !important;
      height: calc(100% - var(--pad-top)) !important;
    }
    ${[querySelectors.video_thumbnail, querySelectors.video_original].join(
		", "
    )} {
      visibility: hidden;
    }

    ${querySelectors.chat_container} {
      top: var(--pad-top) !important;
    }

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
		return function (...args) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn(...args);
			}, delay);
		};
	}

	// FUNCTIONS
	function injectCSS() {
		const styleEl = document.createElement("style");
		styleEl.id = querySelectors.css.substring(1);
		styleEl.innerHTML = css;

		document.head.prepend(styleEl);
	}
	function onResizeChange() {
		let frameStyle = ``;
		if (window.outerWidth < desktopMinWidth) {
			let videoPlayerHeight =
				((window.outerWidth - 48) / 16) * 9;

			if (videoPlayerHeight <= 460) videoPlayerHeight = 460;

			const maxHeight =
				window.outerHeight -
				(emptySpaces -
					headerHeight +
					videoPlayerHeight);
			const height = maxHeight - 24;

			frameStyle = `min-height: 0; max-height: ${maxHeight}px; height: ${height}px; top: 0;`;
		}
		const targetEl = document.querySelector(querySelectors.chat);
		if (typeof targetEl == "object" && targetEl !== null) {
			targetEl.style = frameStyle;
		}
	}

	var removeAdsVideoPlayerInterval = null;
	function removeAdsVideoPlayer() {
		// Note: Will be remove once everything settled up, this function is temporarily assisting.
		// [Remove Adblock Thing 5.5] is using iframe

		const el = document.querySelector("#primary .video-stream");
		if (el && el?.remove) {
			el.remove();
			clearInterval(removeAdsVideoPlayerInterval);
		}
	}

	// ON DOCUMENT LOAD
	function install() {
		// Patch for Remove Adblock Thing 5.5
		// removeAdsVideoPlayerInterval = setInterval(removeAdsVideoPlayer, 100);

		// Customisable, etc...
		setTimeout(function () {
			// Inject CSS
			injectCSS();

			// Live Chat
			onResizeChange();
			window.addEventListener(
				"resize",
				debounce(onResizeChange)
			);
		}, 3000);
	}
	function uninstall() {
		setTimeout(function () {
			document.head.removeChild(
				document.querySelector(querySelectors.css)
			);
			window.removeEventListener("resize");
		}, 100);
	}
	function setup() {
		if (window.location.pathname == "/watch") install();
		else uninstall();
	}
	function StartPathListener() {
		let previousPath = null;
		setInterval(() => {
			if (previousPath == null)
				previousPath = window.location.pathname;
			else if (previousPath !== window.location.pathname) {
				previousPath = window.location.pathname;
				setup();
			}
		}, 500);
	}

	// EXECUTION
	setup();
	StartPathListener();
})();
