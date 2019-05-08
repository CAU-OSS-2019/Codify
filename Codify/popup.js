'use strict';

let codeTextArea = document.getElementById('code');
let resultTextArea = document.getElementById('result');
let compileButton = document.getElementById('compile');

codeTextArea.onkeydown = function(element) {
  if (element.keyCode === 9) { // tab was pressed

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

 compileButton.onclick = function(){
   var code = document.getElementById('code').value;
   resultTextArea.value = code;
 };