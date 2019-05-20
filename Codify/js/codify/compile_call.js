'use strict';


import {
    saveStorage
} from "/js/codify/storage.js";
import {
    changeCompileLabel
} from "/js/codify/result.js";
import connecting from "/js/codify/connect_extension_and_server.js";


// 컴파일 요청 시작 및 결과 처리
const start = async function (lang, code, input, resultTextArea) {
    let compileResult = await connecting(lang, code, input);
    if (compileResult.output === undefined) {
        resultTextArea.value = compileResult.message;
    } else if (compileResult.compile === "FAIL" && compileResult.output === "") {
        // 상태가 FAIL인데 output이 없으면 런타임 에러
        resultTextArea.value = "Runtime Error";
    } else {
        resultTextArea.value = compileResult.output;
    }
    saveStorage({
        readyToCompile: false,
        compileResult: resultTextArea.value,
        compileStatus: compileResult.compile
    }, function () {
        $('#loading').hide();
        changeCompileLabel();
    });
};

export default start;
