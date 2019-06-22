'use strict';

import {
    saveStorage,
} from "/js/codify/storage.js";

let themeCSS = document.getElementById("theme");

// change css file to selected theme
function setTheme(color){
    if (color === "black"){
        themeCSS.href = "/css/codify/style_black.css";
    } else if(color === "white"){
        themeCSS.href = "/css/codify/style_white.css";
    }

    saveStorage({
        theme:color,
    });
}

export { setTheme };