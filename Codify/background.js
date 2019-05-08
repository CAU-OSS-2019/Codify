'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({'storagedCode': ""});
  chrome.contextMenus.create({
    "id": "appendCode",
    "title": "Append to Codify",
    "contexts": ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function(clickData){
  if (clickData.menuItemId === "appendCode"){
    chrome.storage.sync.set({'storagedCode': clickData.selectionText});
  }
});