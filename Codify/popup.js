'use strict';

import connecting from "./connect_extension_and_server.js";

let codeTextArea = document.getElementById('code');
let compileButton = document.getElementById('compile');
let languageSelect = document.getElementById('lang');
let highlightSwitch = document.getElementById('myonoffswitch');

// get storaged code from chrome storage
chrome.storage.sync.get('storagedCode', function(item){
    codeTextArea.value = item.storagedCode;
});

// get toggle switch checked info from chrome storage
chrome.storage.sync.get('autoHighlight', function (item) {
    if (item.autoHighlight) {
        highlightSwitch.checked = true;
    }
    else {
        highlightSwitch.checked = false;
    }
});

// save content of codeTextArea when user change it
codeTextArea.onchange = function(){
  chrome.storage.sync.set({storagedCode: codeTextArea.value});
};

// save toggle switch checked info when user click switch
highlightSwitch.onclick = function () {
    if(highlightSwitch.checked){
        chrome.storage.sync.set({ 'autoHighlight': true });
    }
    else{
        chrome.storage.sync.set({ 'autoHighlight': false });
    }
};

// facilitate 'tab' key in textarea
codeTextArea.onkeydown = function(element){
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

// compile code in codeTextArea and print the result on resultTextArea
 compileButton.onclick = async function(){
  let resultTextArea = document.getElementById('result');
  let code = codeTextArea.value.replace(/\u00a0/g, " ").replace(/\u00c2/g, " ");
  let lang = languageSelect.value;
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
