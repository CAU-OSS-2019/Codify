"use strict";


if (typeof browser === "undefined")
    var browser = chrome;


import {
    noti,
    changePopup
} from "/js/codify/util.js";


$(document).ready(function () {
    $("#a-selector").click(function () {
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
    });

    $("#a-editor").click(function () {
        changePopup("/html/popup.html");
    });

    $("#a-logger").click(function () {
        changePopup("/html/history.html");
    });
});
