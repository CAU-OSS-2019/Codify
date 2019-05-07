// return the data for compile
const startCompiledRequestProcess = (lang, code) => {
    return new Promise((resolve, reject)=>{
        let xml_http = new XMLHttpRequest();
        let compile = JSON.stringify({
            "lang":lang,
            "code":code
        });

        resolve({'xml_http': xml_http, 'compile': compile});
    });
};

// request to compile the input code from extension
function compile_req_to_server(result){
    return new  Promise( (resolve, reject)=>{
        let compile = result.compile;
        let xml_http = result.xml_http;
        xml_http.open("POST", "http://127.0.0.1:3000/compile", true);
        xml_http.setRequestHeader('content-type', 'application/json; charset=utf-8');
        xml_http.send(compile);

        resolve(xml_http);
    });
}

// return json when the server response
const getReqResult = xml_http =>{
    return new Promise( (resolve, reject)=> {
        xml_http.onreadystatechange = function (e) {
            if (xml_http.readyState === XMLHttpRequest.DONE) {
                if (xml_http.status === 200) {
                    let returnVal = JSON.parse(xml_http.responseText);
                    resolve(returnVal);
                } else {
                    console.log("Error!");
                }
            }
        };
    });
};

// event handling when button pressed
window.onload = () => {
    let compileReq = document.getElementById('compile');
    compileReq.addEventListener('click', () => {
        let lang = document.getElementById('lang').value;
        let code = document.getElementById('code').value;

        // specify whether or not the compile request fails
        let id = startCompiledRequestProcess(lang, code)
            .then(compile_req_to_server)
            .then(getReqResult);
    });
};