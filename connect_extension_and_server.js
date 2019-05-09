'use strict';

const TARGETADDRESS = 'http://127.0.0.1:3000';
const INTERVAL = 500;
const MAXTRY = 20;

let connector = {};

// return Promise object with json which is the server send
// use both function to ask server to compile and to get the compile result
const getReqResponse = async xmlHttp =>{

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

// return the data for compile
connector.compileReq = (lang, code) => {
    let compile = JSON.stringify({
        "lang":lang,
        "code":code
    });
    let result;

    result = reqCompile(compile)
        .then(getReqResponse)
        .then(reqCompileSuccess);

    return(result);
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

// check if compile request success
const reqCompileSuccess = result => {
    return new Promise((resolve, reject) => {
        // success
        if(result.success !== false){
            resolve({'id' : result.id, 'maxTry': MAXTRY, 'interval': INTERVAL});
        }
        // fail
        reject('Compile request fail');
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
                            connector.getCompileResult(data);
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

// ask is the compile end
const reqCompiledResult = id => {
    return new Promise(resolve=> {
        let xmlHttp = new XMLHttpRequest() ;
        xmlHttp.open('GET', TARGETADDRESS+'/result/'+id, true);
        xmlHttp.send();

        resolve(xmlHttp);
    });
};

export {connector};