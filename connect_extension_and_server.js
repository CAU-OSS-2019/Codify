'use strict';

const TARGETADDRESS = 'http://127.0.0.1:3000';
const INTERVAL = 500;
const MAXTRY = 20;

// use when need to sleep by await function
const timeout = interval =>{
    return new Promise( resolve => {
        setTimeout(resolve, interval);
    });
};

// return Promise object with json which is the server send
// use both function to ask server to compile and to get the compile result
const getReqResponse = xmlHttp =>{
    return new Promise( (resolve, reject)=> {
        xmlHttp.onreadystatechange = err => {
            if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                if (xmlHttp.status === 200) {
                    let returnVal = JSON.parse(xmlHttp.responseText);
                    resolve(returnVal);
                } else {
                    reject('fail to get response from server');
                    console.log(err);
                }
            }
        };
    });
};

// return Promise object which has the compile result
const compileReqAndGetResult = async (lang, code) => {
    try {
        let id = await compileReq(lang,code);
        return await getCompileResult(id);
    } catch (err){
        return err;
    }
};

// request to compile code
const compileReq = async (lang, code) => {
    let compile = JSON.stringify({
        "lang":lang,
        "code":code
    });

    try{
        let xmlHttpToReqCompile = await reqCompile(compile);
        let data = await getReqResponse(xmlHttpToReqCompile);
        // return id value to request the result of compile
        return await reqCompileSuccess(data);
    } catch (err) {
        return err;
    }
};

// get compiled result of that code
const getCompileResult = async id => {
    try {
        // variable for compile result from server
        let compileResult;
        // variable for count the number of trial
        let i = 0;
        // repeat until the condition is met
        while(true) {
            let xmlHttpToGetCompileResult = await reqCompiledResult(id);
            compileResult = await getReqResponse(xmlHttpToGetCompileResult);
            let result = await checkRetryCondition(compileResult, ++i);
            if (typeof(result) === 'string' && !result) {
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

// request server to compile
const reqCompile = compile => {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('POST', TARGETADDRESS + '/compile', true);
        xmlHttp.setRequestHeader('content-type', 'application/json; charset=utf-8');
        xmlHttp.send(compile);

        resolve(xmlHttp);
    });
};

// check if compile request success and return id for request the result
const reqCompileSuccess = result => {
    return new Promise((resolve, reject) => {
        // success
        if(result.success !== false){
            resolve(result.id);
        }
        // fail
        reject('Compile request fail');
    });
};

// ask is the compile end
const reqCompiledResult = id => {
    return new Promise(resolve=> {
        let xmlHttp = new XMLHttpRequest() ;
        xmlHttp.open('GET', TARGETADDRESS+'/result/'+id, true);
        xmlHttp.send();

        resolve(xmlHttp);
    });
};

// check the condition of the repeat
const checkRetryCondition = (result, trys) => {
    return new Promise((resolve, reject) => {
        // response arrive
        if(result.success === true){
            // if compile status is not 'WAIT', then don't retry
            if(result.compile !== "WAIT") {
                resolve(false);
            } else if(trys < MAXTRY) {
                resolve(true);
            }
            // if maximum number of trial is over, stop asking.
            else {
                reject('compile time over');
            }
        }else{
            reject('connection fail while getting the result of compile');
        }
    });
};


export default compileReqAndGetResult;