const store = () => {
    chrome.storage.local.set({
        key: 'value'
    }, () => {
        console.log('Data saved');
    });
}