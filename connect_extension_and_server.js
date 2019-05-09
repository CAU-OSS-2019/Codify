const TARGETADDRESS = 'http://127.0.0.1:3000';
const INTERVAL = 500;
const MAXTRY = 10;

// return the data for compile
const getIfCompileSuccess = (lang, code) => {
    return new Promise(resolve => {
        let compile = JSON.stringify({
            "lang":lang,
            "code":code
        });
        let result;

        result = compileReq(compile)
            .then(getReqResult);

        resolve(result);
    });
};

const compileReq = compile => {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('POST', TARGETADDRESS + '/compile', true);
        xmlHttp.setRequestHeader('content-type', 'application/json; charset=utf-8');
        xmlHttp.send(compile);

        resolve(xmlHttp);
    });
};

// return json when the server response
const getReqResult = xmlHttp =>{
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

const successToReqCompile = result => {
    return new Promise((resolve, reject) => {
        if(result.success !== false){
            resolve({'id' : result.id, 'maxTry': MAXTRY, 'interval': INTERVAL});
        }
    });
};

const failToReqCompile = result => {
    console.log(result);
};

const getCompileResult = data => {
    return  reqCompiledResult(data.id)
        .then(getReqResult)
        .then(getResult => {
            console.log(data);
            console.log(getResult);
            if(getResult.success === true){
                console.log(1);
                if(getResult.compile !== "WAIT"){
                    return(getResult);
                }else if( data.maxTry > 0){
                    data.maxTry = data.maxTry - 1;
                    setTimeout(() => {
                        getCompileResult(data);
                    }, data.interval);
                }else {
                    return('hello');
                }
            }else{
                return('connection fail while getting the result of compile');
            }
        });
};


const reqCompiledResult = id => {
    return new Promise((resolve, reject) => {
        let xmlHttp = new XMLHttpRequest() ;
        console.log(id);
        console.log(TARGETADDRESS+'/result/'+id);
        xmlHttp.open('GET', TARGETADDRESS+'/result/'+id, true);
        xmlHttp.send();

        resolve(xmlHttp);
    });
};

// event handling when button pressed
window.onload = () => {
    let compileReq = document.getElementById('compile');
    compileReq.addEventListener('click', () => {
        let lang = document.getElementById('lang').value;
        let code = document.getElementById('code').value;

        // specify whether or not the compile request fails
        let id = getIfCompileSuccess(lang, code)
            .then(successToReqCompile)
            .then(getCompileResult)
            .catch(failToReqCompile);
        console.log(id);
    });
};