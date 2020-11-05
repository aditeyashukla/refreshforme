chrome.runtime.onMessage.addListener( function(request,sender,sendResponse) {
    console.log('(background.js) message recieved: '+request.message);
    if( request.message === "reload" ) {
        var code = 'window.location.reload(true);';
        chrome.tabs.executeScript(request.tab, {code: code});
    }
});