chrome.runtime.onMessage.addListener(gotMessage);

let recordButtonHoverColor = "#ea5044";
let recordButtonDefaultColor = "#ea4335"
let recordButtonDownColor = "#ea594d";
let stopButtonHoverColor = "#434649";
let stopButtonDefaultColor = "#3c4043";
let stopButtonDownColor = "#535659";
let hoverColor = recordButtonHoverColor;
let defaultColor = recordButtonDefaultColor;
let downColor = recordButtonDownColor;

let windowOptionsUI;
let button;
let mediaRecorder;

let hasInitialized = false;

// Communication from background.js
function gotMessage(message, sender, sendResponse) {
    if (message === "snap") {
        windowOptionsUI = document.getElementsByClassName('vqs9je')[0];
        if (!hasInitialized) {
            initializeButton();
            initializeDownloader();
            initializeMediaStream();
            hasInitialized = true;
        }
    }
}

function initializeButton() {
    // init
    button = document.createElement("button");

    // style
    button.innerText = "Record";
    button.style.border = "none";
    button.style.borderRadius = "50px";
    button.style.backgroundColor = "#ea4335";
    button.style.color = "#fff";
    button.style.padding = "12px";
    button.style.fontSize = "14px";
    button.style.marginRight = "8px";
    button.style.cursor = "pointer";
    button.id = "btnRecord";

    // add to dom
    windowOptionsUI.prepend(button);

    // button events
    button.addEventListener("click", toggle);
    button.addEventListener("mouseover", hover);
    button.addEventListener("mouseout", out);
    button.addEventListener("mousedown", down);
}

function hover() {
    button.style.backgroundColor = hoverColor;
}

function out() {
    button.style.backgroundColor = defaultColor;
}    

function down() {
    button.style.backgroundColor = downColor;
}

function toggle() {
    console.log(button.id);
    switch (button.id) {
        case "btnRecord":
            button.removeEventListener("click", toggle);
            let t = setTimeout(function() {
                button.id = "btnStop";
                button.textContent = "Stop Recording";
                hoverColor = stopButtonHoverColor;
                defaultColor = stopButtonDefaultColor;
                downColor = stopButtonDownColor;
                button.style.backgroundColor = defaultColor;
                clearTimeout(t);
                button.addEventListener("click", toggle);

                // we can also add event listeners when it changing window
                initializeMediaStream();
                recordMedia();
            }, 500);
            break;
        case "btnStop": 
            button.removeEventListener("click", toggle);
            let t2 = setTimeout(function() {
                button.id = "btnRecord";
                button.textContent = "Record";
                hoverColor = recordButtonHoverColor;
                defaultColor = recordButtonDefaultColor;
                downColor = recordButtonDownColor;
                button.style.backgroundColor = defaultColor;
                clearTimeout(t2);
                button.addEventListener("click", toggle);

                stopMedia();
            }, 2000);
            break;
    }
}

// Gets the main video element
function getVideoDOM() {
    // console.log("getVideoDOM working");

    // Let's compare the video resolutions and get the highest one
    const videoElement = document.querySelectorAll("video");
    // Gets a number of list of video elements shown
    const videoCount = videoElement.length;
    // Declares a videoResolution array to store total pixel resolutions of each video element
    const videoResolution = [];
    // Assigns an each total resolution of each video dom element to the videoResolution array
    for (let i = 0; i < videoCount; i++) {    
        videoResolution[i] = videoElement[i].videoWidth * videoElement[i].videoHeight;
    }
    /**
     * It used the videoResolution array to return a maximum value of total video resolution on each <video> element
     * It iterates over the video field which queries all the video elements
     * It checks if the original video elements dimension matches the total video resolution
     * After iterating and checking for DOM element that matched it then assigns the DOM element to a targetDOM field
     * targetDOM field will be used outside of the for loop and to draw an image with the 2d context canvas
     */ 
    let totalResolution = Math.max.apply(Math, videoResolution);
    for (let d of videoElement) {
        if (d.videoWidth * d.videoHeight == totalResolution) {
            return d;
        }
    }
}

function initializeDownloader() {
    a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
}

function downloadMedia(URL) {
    a.href = URL;
    a.download = "recorded";
    a.click();
}

// Initialize media recorder action events
function initializeMediaStream() {
    let videoDOM = getVideoDOM();
    if (videoDOM.played.length > 0) { // check if dom exist
        let chunks = [];
        mediaStreamObject = videoDOM.captureStream();
        mediaRecorder = new MediaRecorder(mediaStreamObject);
        mediaRecorder.ondataavailable = function(ev) {
            chunks.push(ev.data);
        }
        mediaRecorder.onstop = (ev) => {
            let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
            console.log("blob", blob);
            chunks = [];
            let videoURL = window.URL.createObjectURL(blob);
            downloadMedia(videoURL);
        }
    } 
}

// Record video
function recordMedia() {
    mediaRecorder.start();
    console.log(mediaRecorder.state);
}

// Stop recording video
function stopMedia() {
    mediaRecorder.stop();
    console.log(mediaRecorder.state);
}

// Run at initializer
function initializeHyperlink() {
    a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
}

function downloadMedia(URL) {
    a.href = URL;
    a.download = "recorded";
    a.click();
}






















// chrome.runtime.onMessage.addListener(gotMessage);

// let buttonElement = document.createElement('button');
// let ui;
// let mode = "record";
// let record_hover = "#ea5044";
// let record_default_color = "#ea4335"
// let stop_hover = "#434649";
// let stop_default_color = "#3c4043";
// let a;

// console.log("Test");

// function gotMessage(message, sender, sendResponse) {
//     if (message === "snap") {
//         ui = document.getElementsByClassName('vqs9je')[0];
//         initializeButton();
//         executeClickEvent();
//         executeRecordEvent();
//         initializeHyperlink();
//     }
// }

// // Run at initializer
// function initializeHyperlink() {
//     a = document.createElement("a");
//     document.body.appendChild(a);
//     a.style = "display: none";
// }


// // Gets the main video element
// function getVideoDOM() {
//     // console.log("getVideoDOM working");

//     // Let's compare the video resolutions and get the highest one
//     const videoElement = document.querySelectorAll("video");
//     // Gets a number of list of video elements shown
//     const videoCount = videoElement.length;
//     // Declares a videoResolution array to store total pixel resolutions of each video element
//     const videoResolution = [];
//     // Assigns an each total resolution of each video dom element to the videoResolution array
//     for (let i = 0; i < videoCount; i++) {    
//         videoResolution[i] = videoElement[i].videoWidth * videoElement[i].videoHeight;
//     }
//     /**
//      * It used the videoResolution array to return a maximum value of total video resolution on each <video> element
//      * It iterates over the video field which queries all the video elements
//      * It checks if the original video elements dimension matches the total video resolution
//      * After iterating and checking for DOM element that matched it then assigns the DOM element to a targetDOM field
//      * targetDOM field will be used outside of the for loop and to draw an image with the 2d context canvas
//      */ 
//     let totalResolution = Math.max.apply(Math, videoResolution);
//     for (let d of videoElement) {
//         if (d.videoWidth * d.videoHeight == totalResolution) {
//             return d;
//         }
//     }
// }

// // Initialize media recorder action events
// function initializeMediaEvents(videoDOM) {
//     const mediaStreamObject = videoDOM.captureStream();
//     let mediaRecorder = new MediaRecorder(mediaStreamObject);
//     let chunks = [];

//     mediaRecorder.ondataavailable = function(ev) {
//         chunks.push(ev.data);
//     }
//     mediaRecorder.onstop = (ev) => {
//         let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
//         chunks = [];
//         let videoURL = window.URL.createObjectURL(blob);
//         saveVideo(videoURL);
//     }
// }

// // Record button configuration
// function startRecordEvent() {
//     setButtonId('btnStart');
//     let startButton = document.getElementById('btnStart');
//     startButton.addEventListener('click', recordMedia, false);
//     removeEventListener('click', recordMedia);

//     // Toggle button style
//     buttonElement.onmouseover = function() {
//         setButtonColor(record_hover);
//     }

//     buttonElement.onmouseout = function() {
//         setButtonColor(record_default_color);
//     }

//     mode = "stop";
// }

// // Stop record button configuration
// function startStopEvent() {
//     setButtonId('btnStop');
//     let stopButton = document.getElementById('btnStop');
//     stopButton.addEventListener('click', stopRecordMedia, false);

//     // Toggle button style
//     buttonElement.onmouseover = function() {
//         setButtonColor(stop_hover);
//     }

//     buttonElement.onmouseout = function() {
//         setButtonColor(stop_default_color);
//     }
// }

// // Record video
// function recordMedia() {
//     mediaRecorder.start();
//     console.log(mediaRecorder.state);
// }

// // Stop recording video
// function stopRecordMedia() {
//     mediaRecorder.stop();
//     console.log(mediaRecorder.state);
// }

// // UI Initializing
// function initializeButton() {
//     buttonElement.innerText = "Record";
//     buttonElement.style.border = "none";
//     buttonElement.style.borderRadius = "50px";
//     buttonElement.style.backgroundColor = "#ea4335";
//     buttonElement.style.color = "#fff";
//     buttonElement.style.padding = "12px";
//     buttonElement.style.fontSize = "14px";
//     buttonElement.style.marginRight = "8px";
//     buttonElement.style.cursor = "pointer";
//     buttonElement.id = "btnStart";
//     ui.prepend(buttonElement);
// }

// // Runs the click event
// function executeClickEvent() {
//     buttonElement.onclick = function() {
//         toggle();
//     }
// }

// // Toggles the mode
// function toggle() {
//     if (mode === "record")
//         record();
//     else if (mode === "stop")
//         stop();
// }

// // Setters for buttons
// function setButtonColor(color) {
//     buttonElement.style.backgroundColor = color;
// }

// function setButtonText(text) {
//     buttonElement.textContent = text;
// }

// function setButtonId(id) {
//     buttonElement.id = id;
// }

// function record() {
//     let videoDOM = getVideoDOM();
//     if (videoDOM.played.length > 0) // check if dom exist
//         initializeMediaEvents(videoDOM);
// }

// function stop() {
//     setButtonId("btnStop");
//     setButtonColor(record_default_color);
//     setButtonText("Record");
//     executeRecordEvent();

//     mode = "start";
// }


// // Saves the video

// function saveVideo(URL) {
//     a.href = URL;
//     a.download = "recorded";
//     a.click();
// }