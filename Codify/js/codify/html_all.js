'use strict';

if (typeof browser === "undefined")
    var browser = chrome;

import {
    saveStorage,
    load2Element
} from "/js/codify/storage.js";

import {
    setTheme
} from "/js/codify/set_theme.js";

let highlightSwitch = document.getElementById('myonoffswitch');


// get toggle switch checked info from chrome storage
load2Element(highlightSwitch, 'autoHighlight', function (elem, data) {
    if (data !== undefined)
        elem.checked = data;
});


// save toggle switch checked info when user click switch
highlightSwitch.onclick = function () {
    saveStorage({
        autoHighlight: highlightSwitch.checked
    });
        
    browser.tabs.reload();
};



// get theme of current page.
let themeCSS = document.getElementById("theme");

// set Theme of current page to stored theme
load2Element(themeCSS, 'theme', function (elem, data) {
    if (data !== undefined){
        setTheme(data)
    }
});
