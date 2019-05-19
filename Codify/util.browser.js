'use strict';


// remove invalid char from html to compile successfully
function replaceHTMLSpacing(string) {
    return string.replace(/[\u0080-\u00ff]/g, " ");
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


function noti(msg) {
    chrome.notifications.create("auto-noti-" + Math.random(), {
        type: "basic",
        iconUrl: "images/icon_128.png",
        title: "Codify",
        message: msg
    });
}
