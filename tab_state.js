function logTabs(tabs, removeTabId) {
  var entries = {};
  for (let tab of tabs) {
    if (tab.id !== removeTabId) {
      entries[tab.url] = tab.title;
    }
  }
  browser.storage.local.get().then(data => updateLocal(data, entries), onError);
}

function updateLocal(local, entries) {
  if (!isEqual(local, entries)) {
    browser.storage.local.clear();
    browser.storage.local.set(entries);
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function isEqual(oldDict, newDict) {
  var result = Object.keys(oldDict).length == Object.keys(newDict).length;
  if (result) {
    Object.entries(oldDict).forEach(([key, val]) => {
      if (newDict[key] !== val) {
        result = false;
        return;
      }
    });
  }
  return result;
}

// Odd param, because removing doesn't clear tabs immediately
function getAllTabs(removeTabId) {
  browser.tabs.query({}).then(tabs => logTabs(tabs, removeTabId), onError);
}

function handleUpdated(tabId, changeInfo, tabInfo) {
  getAllTabs();
}

function handleRemoved(tabId, removeInfo) {
  getAllTabs(tabId);
}

browser.tabs.onUpdated.addListener(handleUpdated);
browser.tabs.onRemoved.addListener(handleRemoved);
getAllTabs();