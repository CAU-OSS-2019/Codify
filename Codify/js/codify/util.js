'use strict';


if (typeof browser === "undefined")
    var browser = chrome;


// remove invalid char from html to compile successfully
function replaceHTMLSpacing(string) {
    return string.replace(/[\u0080-\u00ff]/g, " ");
}


// change now popup.html to another html
function changePopup(htmlFilePath) {
    window.location.href = htmlFilePath;
    browser.browserAction.setPopup({
        popup: htmlFilePath
    });
}


// Get all non-empty child text nodes recursively.
function getAllChildTextNodes(rootNode) {
    var textNodes = [];

    for (var node = rootNode.firstChild; node; node = node.nextSibling)
        if (node.nodeType === 3 && /\S/.test(node.nodeValue))
            textNodes.push(node);
        else
            textNodes = textNodes.concat(getAllChildTextNodes(node));

    return textNodes;
}


// Make HTMLElemment from html source
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div;
}


function noti(msg, callback) {
    browser.notifications.create("auto-noti-" + Math.random(), {
        type: "basic",
        iconUrl: "/images/icon_128.png",
        title: "Codify",
        message: msg
    }, callback);
}


function guid() {
    function s4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


export { replaceHTMLSpacing, changePopup, getAllChildTextNodes, createElementFromHTML, noti, guid };
