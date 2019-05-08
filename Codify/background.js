'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({'storagedCode': ""});
  chrome.contextMenus.create({
    "id": "appendCode",
    "title": "Append to Codify",
    "contexts": ["selection"]
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.contextMenus.onClicked.addListener(function(clickData){
  if (clickData.menuItemId === "appendCode"){
    chrome.storage.sync.set({'storagedCode': clickData.selectionText});
  }
});