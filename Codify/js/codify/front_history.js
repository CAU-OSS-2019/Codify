'use strict';


import {
    loadHistory,
    cleanHistory
} from "/js/codify/lib_history.js";
import {
    changePopup
} from "/js/codify/util.js";
import {
    saveStorage
} from "/js/codify/storage.js";


$(document).ready(function () {
    loadHistory(function (arr) {
        window.codifyHistory = arr;

        for (let i = arr.length - 1; i >= 0; i--) {
            let tbody = document.getElementById("history-body");
            let tr = document.createElement("tr");
            tr.id = "codify-history-" + i;
            $(tr).attr("data-no", i);
            tr.className = "codify-history";

            let td = document.createElement("td");
            $(td).text(i + 1);
            tr.appendChild(td);

            let fields = ["lang", "url", "date"];
            for (let j = 0; j < fields.length; j++) {
                td = document.createElement("td");
                if (fields[j] === "url") {
                    let aa = document.createElement("a");
                    aa.href = arr[i][fields[j]];
                    aa.target = "_blank";
                    $(aa).text(aa.href);
                    td.appendChild(aa);
                }
                else {
                    $(td).text(arr[i][fields[j]]);
                }
                tr.appendChild(td);
            }

            $(tr).click(history_click);
            tbody.appendChild(tr);
        }
    });


    $("#clean-log").click(function () {
        cleanHistory(function () {
            changePopup("/html/history.html");
        });
    });


    var history_click = function () {
        let arr = window.codifyHistory;
        let no = Number($(this).attr("data-no"));
        console.log(arr, no);

        let saved = {
            languageSelect: arr[no].langidx,
            lang: arr[no].lang.toLowerCase(),
            storagedCode: arr[no].code,
            storagedStdin: arr[no].stdin,
            readyToCompile: true
        };

        saveStorage(saved, function () {
            changePopup("/html/popup.html");
        });
    };
});
