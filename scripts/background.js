chrome.runtime.onInstalled.addListener(() => {
  console.log('SecurePass Installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'savePassword') {
    savePasswordToStorage(request.site, request.encryptedData);
    sendResponse({ status: 'success' });
  }
});

function savePasswordToStorage(site, encryptedData) {
  chrome.storage.local.get('passwords', function (result) {
    let passwords = result.passwords || {};
    passwords[site] = encryptedData;
    chrome.storage.local.set({ passwords });
  });
}

function getPasswordFromStorage(site, callback) {
  chrome.storage.local.get('passwords', function (result) {
    let passwords = result.passwords || {};
    callback(passwords[site]);
  });
}

