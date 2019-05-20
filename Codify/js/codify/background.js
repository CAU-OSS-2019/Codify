'use strict';


// executed when chrome extension is first installed
chrome.runtime.onInstalled.addListener(function () {
    // initialize storaged code of chrome storage
    chrome.storage.sync.set({ 'storagedCode': "" });

    // initialize auto highlight to true
    chrome.storage.sync.set({ 'autoHighlight': true });

    // create 'Overwrite to Codify' contextMenus
    chrome.contextMenus.create({
        "id": "overwriteCode",
        "title": "Overwrite to Codify",
        "contexts": ["selection"]
    });

    // create 'Append to Codify' contextMenus
    chrome.contextMenus.create({
        "id": "appendCode",
        "title": "Append to Codify",
        "contexts": ["selection"]
    });
});


chrome.contextMenus.onClicked.addListener(function (clickData) {
    // overwrite selected(dragged) code to popup
    if (clickData.menuItemId === "overwriteCode") {
        chrome.tabs.executeScript(null, {
            code: "window.getSelection().toString();"
        }, function (selection) {
            chrome.storage.sync.set({ 'storagedCode': selection });
        });
    }

    // append selected(dragged) code to popup
    else if (clickData.menuItemId === "appendCode") {
        let existingCode, concatCode;
        chrome.tabs.executeScript(null, {
            code: "window.getSelection().toString();"
        }, function (selection) {
            chrome.storage.sync.get('storagedCode', function (item) {
                existingCode = item.storagedCode.toString();
                if (existingCode.localeCompare("") != 0) {
                    //concatCode = existingCode + '\n' + selection.toString();
                    concatCode = existingCode.concat('\n', selection.toString());
                }
                else {
                    concatCode = selection;
                }
                chrome.storage.sync.set({ 'storagedCode': concatCode });
            });
        });
    }
});


chrome.extension.onMessage.addListener(function (myMessage, sender, sendResponse) {
    if (myMessage.type === "noti") {
        noti(myMessage.msg);
    }
    return true;
});


function noti(msg) {
    chrome.notifications.create("auto-noti-" + Math.random(), {
        type: "basic",
        iconUrl: "/images/icon_128.png",
        title: "Codify",
        message: msg
    });
}
