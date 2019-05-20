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
    runBtn.type = "button";
    runBtn.style.display = "block";
    runBtn.onclick = function (e) {
        e.preventDefault();
        browser.storage.sync.set({ "storagedCode": codeCollection[codeNumber - 1] });
        chrome.extension.sendMessage({ type: "noti", msg: "Codify 편집기에 추가되었습니다!" });
    };
    btnLoc.insertBefore(runBtn, btnLoc.firstChild);
}

// Detect C code and wrap it with code element.
function autoDetectC() {
    var codeBeginPatterns = [
        // /^[ \t\u00a0\u00c2]*#[ \t\u00a0\u00c2]*include[ \t\u00a0\u00c2]*(<|")[^>"]+(>|")[ \t\u00a0\u00c2]*$/g,
        /^[^\w가-힣ㄱ-ㅎ]*#[^\w가-힣ㄱ-ㅎ]*include/g,
        /^[^\w가-힣ㄱ-ㅎ]*#[^\w가-힣ㄱ-ㅎ]*pragma[^\w가-힣ㄱ-ㅎ]+[a-zA-Z_]\w*/g,
        /^[^\w가-힣ㄱ-ㅎ]*#[^\w가-힣ㄱ-ㅎ]*define[^\w가-힣ㄱ-ㅎ]+[a-zA-Z_]\w*/g,
        /^[^\w가-힣ㄱ-ㅎ]*(bool|char|signed|unsigned|short|int|long|float|double|struct|union|void)[^\w가-힣ㄱ-ㅎ]+[a-zA-Z_]\w*[^\w가-힣ㄱ-ㅎ]*\(/g
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
        // Collapse adjacent code blocks.
        if (i && endChecks[i - 1] && beginChecks[i])
            endChecks[i - 1] = beginChecks[i] = false;
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

    for (i = 1; i < codeNumber + 1; i++) {
        addRunButton(i);
    }
}

// Init highlight process
function init() {
    var link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css?family=Source+Code+Pro";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

    hljs.initHighlightingOnLoad();
    hljs.configure({ useBR: true });
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
window.onload = function () {
    init();
}
