'use strict';


import {
    saveStorage,
    loadData
} from "/js/codify/storage.js";


// save current code to history
function addCodeToHistory(lang, langidx, code, stdin, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // get current tab's URL
        var activeURL = tabs[0].url;
        // get current date
        var now = new Date();
        var dateStr = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() +
            (now.getHours() < 10 ? " 0" : " ") + now.getHours() + (now.getMinutes() < 10 ? ":0" : ":") + now.getMinutes();

        // load current history array, push and save
        loadData("codify-history", function (data) {
            if (data === undefined) {
                data = [];
            }

            data.push({
                "lang": lang.toUpperCase(),
                "langidx": langidx,
                "code": code,
                "stdin": stdin,
                "url": activeURL,
                "date": dateStr
            });

            saveStorage({ "codify-history": data }, callback);
        });
    });
}


// load all history array and inject to callback
function loadHistory(callback) {
    loadData("codify-history", function (data) {
        if (data === undefined) {
            data = [];
        }

        callback(data);
    });
}


// remove all history
function cleanHistory(callback) {
    saveStorage({ "codify-history": [] }, callback);
}


export { addCodeToHistory, loadHistory, cleanHistory };
