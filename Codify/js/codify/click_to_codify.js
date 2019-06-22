'use strict';


// 포맷팅할 영역을 수동으로 설정
function initCodifySelect() {
    // 영역에 마우스 올리면 테두리 표시시키는 리스너
    $(".codify-select-mode").bind("mouseover.codify", function (e) {
        e.stopPropagation();
        $(".codify-select").removeClass("codify-select");
        $(this).addClass("codify-select");
    });

    // 영역 더블클릭하면 해당 영역을 포맷팅함
    $(".codify-select-mode").bind("dblclick.codify", function (e) {
        e.stopPropagation();
        var textNodes = getAllChildTextNodes(this);

        if (!fixStyle()) {
            for (var i = 0; i < textNodes.length; i++) {
                var tt = textNodes[i];
                var new_parent = document.createElement("div");
                new_parent.className = "codify codify-code codify-c-code cpp codify-selected";
                new_parent.style.display = "inline";
                new_parent.style.padding = "0";
                new_parent.style.margin = "0";
                new_parent.style.background = "white";
                new_parent.textContent = tt.nodeValue;
                new_parent.style.fontFamily = "'Source Code Pro'";
                new_parent.style.letterSpacing = "-0.7px";
                tt.replaceWith(new_parent);
            }

            document.querySelectorAll('.codify-selected').forEach((block) => {
                hljs.highlightBlock(block);
            });
        }

        $("*").removeClass("codify-select");
        $("*").removeClass("codify-select-mode");
        $("*").unbind("dblclick.codify");
        $("*").unbind("mouseover.codify");
        window.codifySelectOn = false;
    });
}
