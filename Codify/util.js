'use strict';


function replaceHTMLSpacing(string) {
    return string.replace(/\u00a0/g, " ").replace(/\u00c2/g, " ");
}


function changePopup(htmlFilePath) {
    window.location.href = htmlFilePath;
    chrome.browserAction.setPopup({
        popup: htmlFilePath
    });
}


export {replaceHTMLSpacing, changePopup};
