'use strict';

// executed when chrome extension is first installed
chrome.runtime.onInstalled.addListener(function () {
  // initialize storaged code of chrome storage
  chrome.storage.sync.set({ 'storagedCode': "" });

  // create 'Overwrite to Codify' contextMenus
  chrome.contextMenus.create({
    "id": "overwriteCode",
    "title": "Overwrite to Codify",
    "contexts": ["selection"]
  });

  // create 'Append to Codify' contextMenus
  chrome.contextMenus.create({
    "id": "appendCode",
    "title": "Append to Codify",
    "contexts": ["selection"]
  });
});


chrome.contextMenus.onClicked.addListener(function (clickData) {
  // overwrite selected(dragged) code to popup
  if (clickData.menuItemId === "overwriteCode") {
    chrome.tabs.executeScript(null, {
      code: "window.getSelection().toString();"
    }, function (selection) {
      chrome.storage.sync.set({ 'storagedCode': selection });
    });
  }

  // append selected(dragged) code to popup
  else if (clickData.menuItemId === "appendCode") {
    let existingCode, concatCode;
    chrome.tabs.executeScript(null, {
      code: "window.getSelection().toString();"
    }, function (selection) {
      chrome.storage.sync.get('storagedCode', function (item) {
        existingCode = item.storagedCode;
        if (existingCode.toString().localeCompare("") != 0) {
          concatCode = existingCode + '\n' + selection;
          //concatCode = existingCode.concat('\n', selection);
        }
        else {
          concatCode = selection;
        }
        chrome.storage.sync.set({ 'storagedCode': concatCode });
      });
    });
  }
});
