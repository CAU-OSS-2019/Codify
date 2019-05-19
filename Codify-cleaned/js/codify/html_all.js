'use strict';


let highlightSwitch = document.getElementById('myonoffswitch');


// get toggle switch checked info from chrome storage
load2Element(highlightSwitch, 'autoHighlight', function (elem, data) {
    if (data !== undefined)
        elem.checked = data;
});


// save toggle switch checked info when user click switch
highlightSwitch.onclick = function () {
    saveStorage({
        autoHighlight: highlightSwitch.checked
    });
};
