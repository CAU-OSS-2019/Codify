"use strict";

// For cross browser compatibility.
if (typeof browser === "undefined")
    var browser = chrome;

// Add a button above the detected code.
// The button changes browser.storage when clicked so the extension can use it.
function addRunButton(codeNumber) {
    var btnLoc = document.getElementById("codify-c-code-" + codeNumber);
    var runBtn = document.createElement('button');
    runBtn.className = "runBtn runBtn-codify";
    runBtn.innerHTML = "<i class='far fa-edit' style='margin-right: 5px;'></i>Edit with Codify";
    runBtn.type = "button";
    runBtn.style.display = "block";
    runBtn.onclick = function (e) {
        e.preventDefault();
        browser.storage.sync.set({"storagedCode": codeCollection[codeNumber - 1]});
        browser.extension.sendMessage({type: "noti", msg: "Codify 편집기에 추가되었습니다!"});
    };
    btnLoc.insertBefore(runBtn, btnLoc.firstChild);
}

// Detect C code and wrap it with code element.
function autoDetectC() {
    var codeBeginPatterns = [
        /^\s*#\s*include/g,
        /^\s*#\s*pragma\s+[a-zA-Z_]\w*/g,
        /^\s*#\s*define\s+[a-zA-Z_]\w*/g,
        /^\s*(bool|char|signed|unsigned|short|int|long|float|double|struct|union|void)\s+[a-zA-Z_]\w*\s*\(/g
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

    var node;
    var newParent;
    var indented;

    var i, j;

    textNodes.forEach(node =>
        beginChecks.push(codeBeginPatterns.some(p => p.test(node.nodeValue))));

    for (i = 0; i < textNodes.length; i++) {
        val = textNodes[i].nodeValue;
        openCount = (val.match(/{/g) || []).length;
        closeCount = (val.match(/}/g) || []).length;
        blockDepth += openCount - closeCount;
        endChecks.push(Boolean(!blockDepth && (openCount || closeCount)));
        // Collapse adjacent code blocks.
        if (i && endChecks[i - 1] && beginChecks[i])
            endChecks[i - 1] = beginChecks[i] = false;
    }

    for (i = 0; i < textNodes.length; i++) {
        if (codeBegan === false && beginChecks[i]) {
            codeBegan = true;
            beginIdx = i;
        } else if (codeBegan === true && endChecks[i]) {
            // Found some code.
            codeBegan = false;

            // If code is too short, skip it.
            if (i !== beginIdx && i - beginIdx < 3)
                continue;

            window.codeCollection.push("");
            codeNumber++;

            // Change style and save code.
            for (j = beginIdx; j <= i; j++) {
                node = textNodes[j];
                newParent = document.createElement("code");
                codeCollection[codeCollection.length - 1] += node.nodeValue + "\n";
                newParent.className = "codify codify-code codify-c-code cpp";
                if (j === beginIdx)
                    newParent.id = "codify-c-code-" + codeNumber;
                newParent.style.display = "inline";
                newParent.style.padding = "0";
                newParent.style.margin = "0";
                newParent.style.background = "transparent";
                newParent.textContent = node.nodeValue;
                newParent.style.fontFamily = "'Codify Source Code Pro'";
                newParent.style.letterSpacing = "-0.7px";
                node.replaceWith(newParent);
            }

            // A little auto indenting & save to global object.
            indented = hljs.highlight("cpp", codeCollection[codeCollection.length - 1], true, false);
            codeCollection[codeCollection.length - 1] = createElementFromHTML(indented.value).innerText;
        }
    }

    // Highlight found area.
    document.querySelectorAll('.codify').forEach(block => hljs.highlightBlock(block));

    for (i = 1; i <= codeNumber; i++)
        addRunButton(i);
}

// Init highlighting process.
function init() {
    hljs.initHighlightingOnLoad();
    hljs.configure({useBR: true});
    window.codeCollection = [];

    // Check whether auto highlight mode is on or not.
    browser.storage.sync.get('autoHighlight', function (item) {
        if (item.autoHighlight)
            // Detect C code.
            autoDetectC();
    });
}


// Do process when loading is finished.
window.onload = function () {
    init();
}
