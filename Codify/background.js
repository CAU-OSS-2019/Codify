'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
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

var contextMenuItem = {
  "id": "appendCode",
  "title": "Append to Codify",
  "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.onClicked.addListener(function(clickData){
  if (clickData.menuItemId === "appendCode"){
    chrome.storage.sync.set({'storagedCode': clickData.selectionText});
  }
});