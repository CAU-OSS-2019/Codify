'use strict';


if (typeof browser === "undefined")
    var browser = chrome;


import {
    saveStorage,
    load2Textarea,
    load2Element
} from "/js/codify/storage.js";

import {
    changePopup,
    guid
} from "/js/codify/util.js";

import {
    addCodeToHistory
} from "/js/codify/lib_history.js";


let codeTextArea = document.getElementById('code');
let stdinTextArea = document.getElementById('input');
let compileButton = document.getElementById('compile');
let downloadButton = document.getElementById('download');
let languageSelect = document.getElementById('lang');

// get storaged language select
load2Element(languageSelect, 'languageSelect', function (elem, data) {
    if (data !== undefined)
        elem.selectedIndex = data;
});

// get storaged code from chrome storage & enable editor
load2Textarea(codeTextArea, 'storagedCode', function () {
    window.editor = CodeMirror.fromTextArea(codeTextArea, {
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        theme: "blackboard",
        mode: "text/x-c++src",
        value: codeTextArea.value
    });
});

// get storaged stdin input from chrome storage
load2Textarea(stdinTextArea, 'storagedStdin');

// save content of field when user change it
languageSelect.onchange = function () {
    saveStorage({
        languageSelect: languageSelect.selectedIndex
    });
    saveStorage({
        lang: languageSelect.options[languageSelect.selectedIndex].id
    });
};

// facilitate 'tab' key in textarea
let tabFunc = function (element) {
    if (element.keyCode === 9) {

        // get caret position/selection
        let val = this.value,
            start = this.selectionStart,
            end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = val.substring(0, start) + '\t' + val.substring(end);

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        return false;
    }
};

stdinTextArea.onkeydown = tabFunc;

// compile code in codeTextArea and print the result on resultTextArea
compileButton.onclick = function () {
    let saved = {
        languageSelect: languageSelect.selectedIndex,
        lang: languageSelect.options[languageSelect.selectedIndex].id,
        storagedCode: window.editor.getValue(),
        storagedStdin: stdinTextArea.value,
        readyToCompile: true
    };
    saveStorage(saved, function () {
        addCodeToHistory(saved.lang, saved.languageSelect, saved.storagedCode, saved.storagedStdin, function () {
            changePopup("/html/result.html");
        });
    });
};


downloadButton.onclick = downloadSource;


// download source code to file
function downloadSource() {
    let sourceStr = window.editor.getValue("\r\n");
    let blob = new Blob([sourceStr], {type: "text/plain"});
    let url = URL.createObjectURL(blob);
    browser.downloads.download({
        url: url,
        filename: guid() + "." + languageSelect.options[languageSelect.selectedIndex].id
    });
}

// maintain editor content when popup closed
window.onblur = function(){
    saveStorage({
        storagedCode: window.editor.getValue()
    });
}