// ==UserScript==
// @name         District Universal Auto Click BOOK TICKETS (Final V5)
// @namespace    district-auto-click
// @version      5.0
// @description  Click BOOK TICKETS automatically regardless of "Notify Me" or "Coming Soon" pre-state
// @match        https://www.district.in/events/*
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_TEXT = "BOOK TICKETS";
    const CLICK_COOLDOWN_MS = 2000;
    let lastClickTime = 0;
    const originalTitle = document.title;

    function playBeep() {
        try {
            const audio = new Audio(
                "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA="
            );
            audio.volume = 1.0;
            audio.play().catch(() => {});
        } catch (e) {}
    }

    function flashTitle() {
        document.title = "⚠ BOOK TICKETS CLICKED!";
        setTimeout(() => {
            document.title = originalTitle;
        }, 5000);
    }

    function clean(text) {
        return text.replace(/\s+/g, " ").trim().toUpperCase();
    }

    function findBookTicketsElement() {
        const allElements = document.querySelectorAll("*");

        for (const el of allElements) {
            const txt = clean(el.textContent || "");
            if (txt === TARGET_TEXT) {
                return el;  // CLICK THE ELEMENT DIRECTLY
            }
        }
        return null;
    }

    function notifyAndClick(btn) {
        const now = Date.now();
        if (now - lastClickTime < CLICK_COOLDOWN_MS) return;

        lastClickTime = now;
        console.log("[District AutoClick] BOOK TICKETS found → clicking:", btn);

        btn.click();
        playBeep();
        flashTitle();
    }

    function tryClick() {
        const btn = findBookTicketsElement();
        if (!btn) return;
        notifyAndClick(btn);
    }

    const observer = new MutationObserver(() => {
        tryClick();
    });

    function init() {
        if (!document.body) {
            setTimeout(init, 200);
            return;
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true  // detects text changes (Coming Soon → Book Tickets)
        });

        setInterval(tryClick, 200);
        tryClick();
    }

    window.addEventListener("pageshow", () => {
        lastClickTime = 0;
        tryClick();
    });

    init();
})();
