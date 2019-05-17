'use strict';
/**
 * @author Lee seung chan
 * @brief connect extension program with server
 * @file connect_extension_and_server.js
 * @todo need to organize functions, need to set constant 'TARGET_ADDRESS'
 *   to server address
 */

// modifying TARGET_ADDRESS constant to match with your server
const TARGET_ADDRESS = 'http://codify.njw.kr:8000';
const INTERVAL = 500;
const MAX_TRY = 20;

/**
 * @brief execute Promise.resolve() function after interval.
 * @param interval
 * @returns {Promise<Promise.resolve>}
 */
const timeout = interval => {
    return new Promise( resolve => {
        setTimeout(resolve, interval);
    });
};

/**
 * @brief get result of the request from server
 * @param xmlHttp
 * @returns {Promise<json>}
 */
const getReqResponse = xmlHttp => {
    return new Promise( (resolve, reject)   => {
        xmlHttp.onreadystatechange = err => {
            if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                if (xmlHttp.status === 200) {
                    let returnVal = JSON.parse(xmlHttp.responseText);
                    resolve(returnVal);
                } else {
                    reject(new Error("Request Fail"));
                }
            }
        };
    });
};

/**
 * @brief request to compile and get the result of the compile
 * request using compileReq function with language data(like 'c', 'c++')
 * and code to compile and get result using getCompile function.
 * @param lang
 * @param code
 * @param stdin
 * @returns {Promise<json>}
 */
const compileReqAndGetResult = async (lang, code, stdin) => {
    try {
        let compile = JSON.stringify({
            'lang':lang,
            'code':code,
            'stdin':stdin
        });
        let id = await compileReq(compile);
        return await getCompileResult(id);
    } catch (err){
        return err;
    }
};

/**
 * @brief request id value from server
 * request using reqCompile to send to server and get result using
 * getReqResponse to get json.
 * @param compile
 * @returns {Promise<int>}
 */
const compileReq = async compile => {
    try{
        let xmlHttpToReqCompile = await reqCompile(compile);
        let data = await getReqResponse(xmlHttpToReqCompile);
        // return id value to request the result of compile
        return await reqCompileSuccess(data);
    } catch (err) {
        return err;
    }
};

/**
 * @brief get compiled result of that code
 * @param id
 * @returns {Promise<json>}
 */
const getCompileResult = async id => {
    try {
        // variable for compile result from server
        let compileResult;
        // variable for count the number of trial
        let i = 0;
        // repeat until the condition is met
        while (true) {
            let xmlHttpToGetCompileResult = await reqCompiledResult(id);
            compileResult = await getReqResponse(xmlHttpToGetCompileResult);
            let result = await checkRetryCondition(compileResult, ++i);
            if (typeof (result) === 'string' || !result) {
                break;
            }
            // delay for to server  with some interval
            await timeout(INTERVAL);
        }
        return compileResult;
    } catch (err) {
        return err;
    }
};

/**
 * @brief request server to compile
 * @param compile
 * @returns {Promise<XMLHttpRequest object>}
 */
const reqCompile = compile => {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('POST', TARGET_ADDRESS + '/api/compile', true);
        xmlHttp.setRequestHeader(
            'content-type',
            'application/json; charset=utf-8'
        );
        xmlHttp.send(compile);
        resolve(xmlHttp);
    });
};

/**
 * @brief check if compile request success and return id for request the result
 * @param result
 * @returns {Promise<int>}
 */
const reqCompileSuccess = result => {
    return new Promise((resolve, reject) => {
        // success
        if(result.success !== false){
            resolve(result.id);
        }
        // fail
        reject(new Error('Compile request fail'));
    });
};

/**
 * @brief ask is the compile end
 * @param id
 * @returns {Promise<XMLHttpRequest object>}
 */
const reqCompiledResult = id => {
    return new Promise(resolve=> {
        let xmlHttp = new XMLHttpRequest() ;
        xmlHttp.open('GET', TARGET_ADDRESS+'/api/result/'+id, true);
        xmlHttp.send();
        resolve(xmlHttp);
    });
};

/**
 * @brief check the condition of the repeat
 * @param result
 * @param trial
 * @returns {Promise<boolean>}
 */
const checkRetryCondition = (result, trial) => {
    return new Promise((resolve, reject) => {
        // response arrive
        if(result.success === true){
            // if compile status is not 'WAIT', then don't retry
            if(result.compile !== "WAIT") {
                resolve(false);
            } else if(trial <= MAX_TRY) {
                resolve(true);
            }
            // if maximum number of trial is over, stop asking.
            else {
                reject(new Error('compile time over'));
            }
        }else{
            reject(new Error('connection fail while getting the result of compile'));
        }
    });
};


export default compileReqAndGetResult;
