"use strict";


import {
    noti
} from "/js/codify/util.js";


$(document).ready(function () {
    $("#a-selector").click(function () {
        chrome.tabs.executeScript(null, {
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
});
