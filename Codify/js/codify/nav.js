"use strict";


if (typeof browser === "undefined")
    var browser = chrome;

import {
    saveStorage,
    load2Element
} from "/js/codify/storage.js";
    
import {
    noti,
    changePopup
} from "/js/codify/util.js";


let themeCSS = document.getElementById("theme");
let themeColor = "black"

load2Element(themeCSS, 'theme', function (elem, data) {
    if (data !== undefined){
        setTheme(data)
    }
});

function setTheme(color){
    if (color == "black"){
        themeCSS.href = "/css/codify/style_black.css"
        themeColor = "black"
    }
    else if(color == "white"){
        themeCSS.href = "/css/codify/style_white.css"
        themeColor = "white"
    }
    saveStorage({
        theme:themeColor
    });
}

function changeTheme() {
    if(themeColor == "black"){
        setTheme("white")
    }
    else if (themeColor == "white"){
        setTheme("black")
    }
}

$(document).ready(function () {
    $("#a-selector").click(function () {
        browser.tabs.executeScript(null, {
            code: 'fixStyle();'
        }, function (r) {
            if (!r[0]) {
                browser.tabs.executeScript(null, {
                    code: 'if (window.codifySelectOn) { \n' +
                        '   $("*").removeClass("codify-select-mode"); \n' +
                        '   window.codifySelectOn = false; \n' +
                        '} \n' +
                        'else { \n' +
                        '   $("*").addClass("codify-select-mode"); \n' +
                        '   window.codifySelectOn = true; \n' +
                        '} \n' +
                        'initCodifySelect();'
                });
                $("#myNavbar").collapse("hide");
                noti("포맷팅할 영역을 더블클릭하세요.", function () {
                    window.close();
                });
            }
            else {
                noti("해당 페이지는 지원되지 않습니다.");
            }
        })
    });

    $("#a-editor").click(function () {
        changePopup("/html/popup.html");
    });

    $("#a-logger").click(function () {
        changePopup("/html/history.html");
    });

    $("#a-change-theme").click(function () {
        changeTheme();
    });

});
