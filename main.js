// ==UserScript==
// @name         Replace Avatar and Email on Claude.ai
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Customize the default avatar and name that cannot be modified on Claude.ai to a personalized avatar and name
// @author
// @match        https://claude.ai/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    let customAvatarDataURI = GM_getValue('customAvatarDataURI', 'data:image/png;base64,(Base64)');
    let userName = GM_getValue('userName', 'YOUR NAME');

    function replaceContent() {
        const avatars = document.querySelectorAll('div.flex.shrink-0.items-center.justify-center.rounded-full.h-7.w-7');
        avatars.forEach(avatar => {
            if (avatar.style.backgroundImage && avatar.style.backgroundImage.includes('data:image')) return;
            avatar.textContent = '';
            avatar.classList.remove('font-bold', 'text-[12px]', 'bg-text-200', 'text-bg-100');
            avatar.style.backgroundImage = `url("${customAvatarDataURI}")`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
        });

        const emailElements = document.querySelectorAll('div.min-w-0.flex-1.truncate.text-sm');
        emailElements.forEach(el => {
            if (el.textContent.includes('@')) {
                el.textContent = userName;
            }
        });
    }

    const observer = new MutationObserver((mutations, obs) => {
        replaceContent();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    replaceContent();

    GM_registerMenuCommand("Set Custom Avatar Data", () => {
        const newURI = prompt("Please enter the new custom avatar Base64 Data: (If 'data:image/png;base64,' is not included, it will be automatically added.)", customAvatarDataURI);
        if (newURI !== null && newURI.trim() !== "") {
            let uri = newURI.trim();
            if (!uri.startsWith("data:image/png;base64,")) {
                uri = "data:image/png;base64," + uri;
            }
            GM_setValue('customAvatarDataURI', uri);
            customAvatarDataURI = uri;
            replaceContent();
            alert("Custom avatar has been updated!");
        }
    });

    GM_registerMenuCommand("Set Username", () => {
        const newName = prompt("Please enter a new username:", userName);
        if (newName !== null && newName.trim() !== "") {
            GM_setValue('userName', newName.trim());
            userName = newName.trim();
            replaceContent();
            alert("Username has been updated!");
        }
    });
})();
