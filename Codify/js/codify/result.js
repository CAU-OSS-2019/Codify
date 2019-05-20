'use strict';


import compileCall from "/js/codify/compile_call.js";
import {
    load2Textarea,
    loadFields
} from "/js/codify/storage.js";
import {
    replaceHTMLSpacing,
    changePopup
} from "/js/codify/util.js";


let resultTextarea = document.getElementById("result");
let returnButton = document.getElementById("return");


function initCompile() {
    loadFields(["lang", "storagedCode", "storagedStdin"], function (item) {
        let lang = item.lang;
        let code = replaceHTMLSpacing(item.storagedCode);
        let input = replaceHTMLSpacing(item.storagedStdin);
        compileCall(lang, code, input, resultTextarea);
    });
}


function changeCompileLabel() {
    loadFields(["compileStatus"], function (item) {
        if (item.compileStatus === "FAIL") {
            $('#success').hide();
            $('#error').css("display", "inline-block");
            $('#wait').hide();
        }
        else if (item.compileStatus === "WAIT") {
            $('#success').hide();
            $('#error').hide();
            $('#wait').css("display", "inline-block");
        }
        else {
            $('#success').css("display", "inline-block");
            $('#error').hide();
            $('#wait').hide();
        }
    });
}


returnButton.onclick = () => {
    changePopup("/html/popup.html");
};


loadFields(["readyToCompile"], function (item) {
    if (item.readyToCompile) {
        initCompile();
    }
    else {
        $('#loading').hide();
        load2Textarea(resultTextarea, "compileResult");
        changeCompileLabel();
    }
});


export { changeCompileLabel };
