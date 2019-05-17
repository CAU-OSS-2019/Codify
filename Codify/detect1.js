"use strict";

if (typeof browser === "undefined")
    var browser = chrome;

// Currently developing.
// Add a button above the detected code.
// The button changes browser.storage when clicked so the extension can use it.
function addRunButton(codeNumber) {
        var btnLoc = document.getElementById("codify-c-code-" + codeNumber);
        var runBtn = document.createElement('button');
        runBtn.className = "runBtn runBtn-codify";
        runBtn.innerHTML = "<i class='far fa-edit' style='margin-right: 5px;'></i>Edit with Codify";
        runBtn.type = "button"
        runBtn.style.display = "block";
        runBtn.onclick = function() {
            browser.storage.sync.set({"storagedCode": codeCollection[codeNumber - 1]});
        };
        btnLoc.insertBefore(runBtn, btnLoc.firstChild);
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

// Detect C code and wrap it with code element.
function autoDetectC() {
    var codeBeginPatterns = [
        /# *include *(<|")[^>"]+(>|")/g,
        /# *pragma/g,
        /(bool|char|signed|unsigned|short|int|long|float|double|struct|union|void) +[a-zA-Z_]\w*[ \t]*\(/g
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
            // found some code
            codeBegan = false;

            // if code is too short, skip it
            if (i - beginIdx < 3) continue;

            window.codeCollection.push("");
            codeNumber++;

            // change style and save code
            for (var j = beginIdx; j <= i; j++) {
                var tt = textNodes[j];
                var new_parent = document.createElement("code");
                codeCollection[codeCollection.length - 1] = codeCollection[codeCollection.length - 1] + tt.nodeValue + "\n";
                new_parent.className = "codify codify-code codify-c-code cpp";
                if (j === beginIdx) {
                    new_parent.id = "codify-c-code-" + codeNumber;
                }
                new_parent.style.display = "inline";
                new_parent.style.padding = "0";
                new_parent.style.margin = "0";
                new_parent.style.background = "transparent";
                new_parent.textContent = tt.nodeValue;
                new_parent.style.fontFamily = "'Source Code Pro'";
                new_parent.style.letterSpacing = "-0.7px";
                tt.replaceWith(new_parent);
            }

            // a little auto indenting & save to global object
            var indented = hljs.highlight("cpp", codeCollection[codeCollection.length - 1], true, false);
            codeCollection[codeCollection.length - 1] = createElementFromHTML(indented.value).innerText;

            // highlight found area
            document.querySelectorAll('.codify').forEach((block) => {
                hljs.highlightBlock(block);
            });
       }
    }

    console.log(codeNumber);
    for(i = 1; i < codeNumber + 1; i++) {
        addRunButton(i);
    }
}

// Init highlight process
function init() {
    var link1 = document.createElement("link");
    link1.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/github.min.css";
    link1.type = "text/css";
    link1.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link1);

    var link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css?family=Source+Code+Pro";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

    hljs.initHighlightingOnLoad();
    hljs.configure({useBR: true});
    window.codeCollection = [];

    // check whether auto highlight mode is on or not
    chrome.storage.sync.get('autoHighlight', function (item) {
        if (item.autoHighlight) {
            // Detect C code.
            autoDetectC();
        }
    });
}


// do process when loading is finish
window.onload = function() {
    init();
}
