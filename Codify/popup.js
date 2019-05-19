'use strict';

import connecting from "./connect_extension_and_server.js";
import {save2Storage, load2Textarea, load2Element} from "./storage.js";

let codeTextArea = document.getElementById('code');
let stdinTextArea = document.getElementById('input');
let compileButton = document.getElementById('compile');
let languageSelect = document.getElementById('lang');
let highlightSwitch = document.getElementById('myonoffswitch');

// get storaged language select
load2Element(languageSelect, 'languageSelect', function(elem, data) {
    if (data !== undefined)
        elem.selectedIndex = data;
});

// get storaged code from chrome storage
load2Textarea(codeTextArea, 'storagedCode');

// get storaged stdin input from chrome storage
load2Textarea(stdinTextArea, 'storagedStdin');

// get toggle switch checked info from chrome storage
load2Element(highlightSwitch, 'autoHighlight', function(elem, data) {
    elem.checked = data;
});

// save content of field when user change it
languageSelect.onchange = function() {
    save2Storage('languageSelect', languageSelect.selectedIndex);
};
codeTextArea.onchange = function() {
    save2Storage('storagedCode', codeTextArea.value);
};
stdinTextArea.onchange = function() {
    save2Storage('storagedStdin', stdinTextArea.value);
};

// save toggle switch checked info when user click switch
highlightSwitch.onclick = function() {
    save2Storage('autoHighlight', highlightSwitch.checked);
};

// facilitate 'tab' key in textarea
var tabFunc = function(element) {
    if (element.keyCode === 9) {

        // get caret position/selection
        var val = this.value,
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

codeTextArea.onkeydown = tabFunc;
stdinTextArea.onkeydown = tabFunc;

// compile code in codeTextArea and print the result on resultTextArea
compileButton.onclick = async function() {
  let resultTextArea = document.getElementById('result');
  let code = codeTextArea.value.replace(/\u00a0/g, " ").replace(/\u00c2/g, " ");
  let lang = languageSelect.options[languageSelect.selectedIndex].id;
  let input = document.getElementById('input').value;
  let compileResult = await connecting(lang, code, input);
  if(compileResult.output === undefined) {
      resultTextArea.value = compileResult.message;
  } else if(compileResult.output === ""){
      resultTextArea.value = "Runtime Error";
  } else {
      resultTextArea.value = compileResult.output;
  }
};
