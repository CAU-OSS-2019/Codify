'use strict';


function saveStorage(pair, callback) {
    chrome.storage.sync.set(pair, callback);
}


function load2Textarea(textarea, fieldName) {
    chrome.storage.sync.get([fieldName], function(item) {
        if (item[fieldName] !== undefined)
            textarea.value = item[fieldName];
        else
            textarea.value = "";
    });
}


function load2Element(element, fieldName, callback) {
    chrome.storage.sync.get([fieldName], function(item) {
        callback(element, item[fieldName]);
    });
}


function loadData(fieldName, callback) {
    chrome.storage.sync.get([fieldName], function(item) {
        callback(fieldName);
    })
}


function loadFields(fieldsArray, callback) {
    chrome.storage.sync.get(fieldsArray, callback);
}


export {saveStorage, load2Textarea, load2Element, loadData, loadFields};
