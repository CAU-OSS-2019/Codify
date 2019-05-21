'use strict';


if (typeof browser === "undefined")
    var browser = chrome;


function saveStorage(pair, callback) {
    browser.storage.sync.set(pair, callback);
}


function load2Textarea(textarea, fieldName, callback) {
    browser.storage.sync.get([fieldName], function (item) {
        if (item[fieldName] !== undefined)
            textarea.value = item[fieldName];
        else
            textarea.value = "";
        if (callback !== undefined)
            callback();
    });
}


function load2Element(element, fieldName, callback) {
    browser.storage.sync.get([fieldName], function (item) {
        callback(element, item[fieldName]);
    });
}


function loadData(fieldName, callback) {
    browser.storage.sync.get([fieldName], function (item) {
        callback(item[fieldName]);
    });
}


function loadFields(fieldsArray, callback) {
    browser.storage.sync.get(fieldsArray, callback);
}


export { saveStorage, load2Textarea, load2Element, loadData, loadFields };
