'use strict';


// remove invalid char from html to compile successfully
function replaceHTMLSpacing(string) {
    return string.replace(/[\u0080-\u00ff]/g, " ");
}


// Get all non-empty child text nodes excluding style, script nodes recursively.
function getAllChildTextNodes(rootNode) {
    var textNodes = [];

    for (var node = rootNode.firstChild; node; node = node.nextSibling)
        if (node.nodeType === 3
            && /\S/.test(node.nodeValue)
            && !/(style|script)/i.test(node.parentNode.nodeName))
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
