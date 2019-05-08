'use strict';

// get storaged code from chrome storage
//$(document).ready(function(){
  chrome.storage.sync.get('storagedCode', function(item){
      codeTextArea.value = item.storagedCode;
  });
//});

let codeTextArea = document.getElementById('code');
let compileButton = document.getElementById('compile');

// save content of codeTextArea when user change it
codeTextArea.onchange = function(){
  chrome.storage.sync.set({storagedCode: codeTextArea.value});
};

// facilitate 'tab' key in textarea
codeTextArea.onkeydown = function(element) {
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
 compileButton.onclick = function(){
  let resultTextArea = document.getElementById('result');
  var code = codeTextArea.value;
  var compileResult = "Result";

  //************************ */
  // compile 'code' and save result in variable 'compileResult'
  //************************ */

  resultTextArea.value = compileResult;
 };