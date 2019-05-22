'use strict';


if (typeof browser === "undefined")
    var browser = chrome;


// executed when chrome extension is first installed
browser.runtime.onInstalled.addListener(function () {
    // initialize storaged code of chrome storage
    browser.storage.sync.set({ 'storagedCode': "" });

    // initialize auto highlight to true
    browser.storage.sync.set({ 'autoHighlight': true });

    // create 'Overwrite to Codify' contextMenus
    browser.contextMenus.create({
        "id": "overwriteCode",
        "title": "Overwrite to Codify",
        "contexts": ["selection"]
    });

    // create 'Append to Codify' contextMenus
    browser.contextMenus.create({
        "id": "appendCode",
        "title": "Append to Codify",
        "contexts": ["selection"]
    });
});


browser.contextMenus.onClicked.addListener(function (clickData) {
    // overwrite selected(dragged) code to popup
    if (clickData.menuItemId === "overwriteCode") {
        browser.tabs.executeScript(null, {
            code: "window.getSelection().toString();"
        }, function (selection) {
            browser.storage.sync.set({ 'storagedCode': selection });
        });
    }

    // append selected(dragged) code to popup
    else if (clickData.menuItemId === "appendCode") {
        let existingCode, concatCode;
        browser.tabs.executeScript(null, {
            code: "window.getSelection().toString();"
        }, function (selection) {
            browser.storage.sync.get('storagedCode', function (item) {
                existingCode = item.storagedCode.toString();
                if (existingCode.localeCompare("") != 0) {
                    //concatCode = existingCode + '\n' + selection.toString();
                    concatCode = existingCode.concat('\n', selection.toString());
                }
                else {
                    concatCode = selection;
                }
                browser.storage.sync.set({ 'storagedCode': concatCode });
            });
        });
    }
});


browser.extension.onMessage.addListener(function (myMessage, sender, sendResponse) {
    if (myMessage.type === "noti") {
        noti(myMessage.msg);
    }
    return true;
});


function noti(msg) {
    browser.notifications.create("auto-noti-" + Math.random(), {
        type: "basic",
        iconUrl: "/images/icon_128.png",
        title: "Codify",
        message: msg
    });
}
