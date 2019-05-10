'use strict';

// executed when chrome extension is first installed
chrome.runtime.onInstalled.addListener(function() {
  // initialize storaged code of chrome storage
  chrome.storage.sync.set({'storagedCode': ""});

  // create 'Append to Codify' contextMenus
  chrome.contextMenus.create({
    "id": "appendCode",
    "title": "Append to Codify",
    "contexts": ["selection"]
  });
});

// append selected(dragged) code to popup
chrome.contextMenus.onClicked.addListener(function(clickData){
  if (clickData.menuItemId === "appendCode"){
    chrome.tabs.executeScript(null, {
      code: "window.getSelection().toString();"
    }, function(selection){
      chrome.storage.sync.set({'storagedCode': selection});
    });
  }
});