"use strict";

if (typeof browser === "undefined")
    var browser = chrome;

// Currently developing.
// Add a button above the detected code.
// The button changes browser.storage when clicked so the extension can use it.
function addRunButton(codeNumber) {
        var btnLoc = document.getElementById("codify-c-code-" + codeNumber);
        var runBtn = document.createElement('button');
        runBtn.className = "runBtn";
        runBtn.textContent = "Append to codify";
        runBtn.type = "button"
        runBtn.onclick = function() {
            var codeText = "";
            var textNodes = getAllChildTextNodes(btnLoc);
            textNodes.slice(1).forEach(node => 
                codeText += node.nodeValue + '\n');
            browser.storage.sync.set({"storagedCode": codeText});
        };
        btnLoc.insertBefore(runBtn, btnLoc.firstChild);
}


// Currently developing.
// Highlight detected code using highlight.js.
/*
function autoHighlight() {
    var script = document.createElement("script");

    script.type = "text/javascript";
    script.async = true;
    script.onload = function() {
        hljs.initHighlightingOnLoad();
        hljs.configure({useBR: true});
        document.querySelectorAll("code.codify-code").forEach(block => {
            hljs.highlightBlock(block);
        });
    };
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);   
}
*/

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

// Detect C code and wrap it with code element.
function detectC() {
    var codeBeginPatterns = [
        /# *include *(<|")[^>"]+(>|")/g,
        /# *pragma/g,
        /(char|signed|unsigned|short|int|long|float|double|struct|union) *[a-zA-Z_]\w*\(/g
    ];

    var textNodes = getAllChildTextNodes(document.body);

    var beginChecks = [];
    var endChecks = [];

    var blockDepth = 0;
    
    var val;
    var openCount;
    var closeCount;

    var codeBegan = false;
    var beginIdx;

    var range = document.createRange();
    var codeElement;
    var codeNumber = 0;

    var i;

    textNodes.forEach(node =>
        beginChecks.push(codeBeginPatterns.some(p => p.test(node.nodeValue))));

    for (i = 0; i < textNodes.length; i++) {
        val = textNodes[i].nodeValue;
        openCount = (val.match(/{/g) || []).length;
        closeCount = (val.match(/}/g) || []).length;
        blockDepth += openCount - closeCount;
        endChecks.push(Boolean(!blockDepth && (openCount || closeCount)));
    }

    for (i = 0; i < textNodes.length; i++) {
        if (codeBegan === false && beginChecks[i]) {
            codeBegan = true;
            beginIdx = i;
        } else if (codeBegan === true && endChecks[i]) {
            codeBegan = false;

            codeElement = document.createElement("code");
            codeElement.id = "codify-c-code-" + ++codeNumber;
            codeElement.className = "codify codify-code codify-c-code";

            range.setStartBefore(textNodes[beginIdx].parentNode);
            range.setEndAfter(textNodes[i].parentNode);
            range.surroundContents(codeElement);

            addRunButton(codeNumber);
            //autoHighlight(codeNumber);
        }
    }    
}

// Detect C code.
detectC();