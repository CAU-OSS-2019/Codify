'use strict';

import {
    saveStorage,
    load2Textarea,
    load2Element
} from "./storage.js";
import {
    changePopup
} from "./util.js";

let codeTextArea = document.getElementById('code');
let stdinTextArea = document.getElementById('input');
let compileButton = document.getElementById('compile');
let languageSelect = document.getElementById('lang');
let highlightSwitch = document.getElementById('myonoffswitch');

// get storaged language select
load2Element(languageSelect, 'languageSelect', function (elem, data) {
    if (data !== undefined)
        elem.selectedIndex = data;
});

// get storaged code from chrome storage & enable editor
load2Textarea(codeTextArea, 'storagedCode', function() {
    window.editor = CodeMirror.fromTextArea(codeTextArea, {
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        theme: "blackboard",
        mode: "text/x-c++src",
        value: codeTextArea.value
    });
    window.editor.on("change", function() {
        saveStorage({
            storagedCode: window.editor.getValue()
        });
    });
});

// get storaged stdin input from chrome storage
load2Textarea(stdinTextArea, 'storagedStdin');

// get toggle switch checked info from chrome storage
load2Element(highlightSwitch, 'autoHighlight', function (elem, data) {
    if (data !== undefined)
        elem.checked = data;
});

// save content of field when user change it
languageSelect.onchange = function () {
    saveStorage({
        languageSelect: languageSelect.selectedIndex
    });
    saveStorage({
        lang: languageSelect.options[languageSelect.selectedIndex].id
    });
};
stdinTextArea.onchange = function () {
    saveStorage({
        storagedStdin: stdinTextArea.value
    });
};

// save toggle switch checked info when user click switch
highlightSwitch.onclick = function () {
    saveStorage({
        autoHighlight: highlightSwitch.checked
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
    saveStorage({
        languageSelect: languageSelect.selectedIndex,
        lang: languageSelect.options[languageSelect.selectedIndex].id,
        storagedCode: window.editor.getValue(),
        storagedStdin: stdinTextArea.value,
        readyToCompile: true
    }, function () {
        changePopup("result.html");
    });
};
