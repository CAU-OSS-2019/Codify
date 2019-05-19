'use strict';

import {
    saveStorage
} from "./storage.js";
import {
    changeCompileLabel
} from "./result.js";
import connecting from "./connect_extension_and_server.js";

const start = async function (lang, code, input, resultTextArea) {
    let compileResult = await connecting(lang, code, input);
    if (compileResult.output === undefined) {
        resultTextArea.value = compileResult.message;
    } else if (compileResult.compile === "FAIL" && compileResult.output === "") {
        resultTextArea.value = "Runtime Error";
    } else {
        resultTextArea.value = compileResult.output;
    }
    saveStorage({
        readyToCompile: false,
        compileResult: resultTextArea.value,
        compileStatus: compileResult.compile
    }, function() {
        $('#loading').hide();
        changeCompileLabel();
    });
};

export default start;
