'use strict';

const TARGETADDRESS = 'http://127.0.0.1:3000';
const INTERVAL = 500;
const MAXTRY = 20;

let connector = {};

// return Promise object with json which is the server send
const getReqResponse = xmlHttp =>{
    return new Promise( (resolve, reject)=> {
        xmlHttp.onreadystatechange = function (e) {
            if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                if (xmlHttp.status === 200) {
                    let returnVal = JSON.parse(xmlHttp.responseText);
                    resolve(returnVal);
                } else {
                    reject('fail to get response from server');
                    console.log(e);
                }
            }
        };
    });
};

// return the data for compile
connector.getIfCompileSuccess = (lang, code) => {
    let compile = JSON.stringify({
        "lang":lang,
        "code":code
    });
    let result;

    result = compileReq(compile)
        .then(getReqResponse)
        .then(successToReqCompile);

    return(result);
};

// request server to compile
const compileReq = compile => {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('POST', TARGETADDRESS + '/compile', true);
        xmlHttp.setRequestHeader('content-type', 'application/json; charset=utf-8');
        xmlHttp.send(compile);

        resolve(xmlHttp);
    });
};

// check if compile request success
const successToReqCompile = result => {
    return new Promise((resolve, reject) => {
        if(result.success !== false){
            resolve({'id' : result.id, 'maxTry': MAXTRY, 'interval': INTERVAL});
        }
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

// return compile output
connector.getCompileResult = data => {
    // request is the compile over
    return  reqCompiledResult(data.id)
        .then(getReqResponse)
        .then(getResult => {
            return new Promise((resolve, reject) => {
                // response arrive
                if(getResult.success === true){
                    // if compile status is not 'WAIT' return the Promise
                    if(getResult.compile !== "WAIT"){
                        resolve(getResult);
                    }else if( data.maxTry > 0){
                        data.maxTry = data.maxTry - 1;
                        setTimeout(() => {
                            getCompileResult(data);
                        }, data.interval);
                    }else {
                        reject('Compile Time Over');
                    }
                }else{
                    reject('connection fail while getting the result of compile');
                }
            });
        });
};

export {connector};
