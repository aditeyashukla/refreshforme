const sec = document.getElementById("seconds");
const min = document.getElementById("minutes");
const statusButton = document.getElementById("status");

let refresh_interval = 0;
let state = false;

// passes message to background.js with the message to reload
function reload() {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.runtime.sendMessage({message: "reload",tab:tab.id});
    });

}

function statusClick(e) {
    if(state === false){
        refresh_interval = (parseInt(min.value)*60)+parseInt(sec.value);
        if(refresh_interval !== 0) {

            statusButton.innerText = "STOP";
            countdown(refresh_interval);
            state = true;
        }
        else {
            alert('Enter something greater than zero lol');
        }
    }
    else{ // ss_state == true
        chrome.runtime.sendMessage({message: "stop"});
        statusButton.innerText = "START";
        state = false;
        // erase badge
        chrome.browserAction.setBadgeText({text:''});
        // refresh extension to erase previous intervals (which will trigger 'resetAll()')
        window.location.reload(true);
    }
}

// use to reset all relevant vars
function resetAll(){
    sec.innerHTML = 0;
    min.innerHTML = 0;
    refresh_interval = 0;
    state = false;
    chrome.browserAction.setBadgeText({text:''});

}


// countdown logic := count to zero, when zero is met reset timer and refresh page
function countdown(time){
    var t = time;
    var x = setInterval((function(){
        setInterval(function() {
            // only carry on if in active state
            if(state === true){
                // set badge text
                chrome.browserAction.setBadgeText({text:''+t});
                // decerement time
                t--;
                // if time is below zero reset counter and refresh page
                if(t<0){
                    reload();
                    t = time;
                }
            }
            else { // ss_state == false
                // clear previously set timing interval
                clearInterval(x);
                // remove badge from icon
                chrome.browserAction.setBadgeText({text:''});
            }
        }, 1000);
    })(), 0);
}

// add event listeners after DOM has fully loaded (`DOMContentLoaded`)
document.addEventListener('DOMContentLoaded', function () {
    // reset all global vars and badge
    resetAll();
    statusButton.addEventListener('click', statusClick);
});