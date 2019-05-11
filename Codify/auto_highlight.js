function auto_highlight(document){
    var script = document.createElement('script');
    script.onload = function () {
        hljs.initHighlightingOnLoad();
        hljs.configure({useBR: true});
        document.querySelectorAll('code.cpp').forEach((block) => {
            hljs.highlightBlock(block);
        });
    };
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);   
}
