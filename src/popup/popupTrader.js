// var isOn;
// myStorage = window.localStorage;

// async function init() {
//   var value = myStorage.getItem("value");
//   bVal = value === "true" ? true : false;
//   document.querySelector("#traderCheckBox").checked = bVal;

//   if (value === undefined) {
//     setValue(false);
//   } else {
//     setValue(bVal);
//     if (bVal) {
//     }
//   }
// }

// async function setValue(value) {
//   isOn = value;
//   myStorage.setItem("value", value);
// }

var portFromCS;

function connected(p) {
  portFromCS = p;
  portFromCS.postMessage({greeting: "hi there content script!"});
  portFromCS.onMessage.addListener(function(m) {
    console.log("In background script, received message from content script")
    console.log(m.greeting);
  });
}

browser.runtime.onConnect.addListener(connected);

browser.browserAction.onClicked.addListener(function() {
  portFromCS.postMessage({greeting: "they clicked the button!"});
});

// // function traderOn() {
// //   if (isOn !== undefined && isOn) {
// //     browser.tabs
// //       .executeScript({ file: "/src/content_scripts/instantBuy.js" })
// //       .catch(reportExecuteScriptError);
// //   }
// // }

// /**
//  * There was an error executing the script.
//  * Display the popup's error message, and hide the normal UI.
//  */
// function reportExecuteScriptError(error) {
//   document.querySelector("#error-content").classList.remove("hidden");
//   console.log("Failed to execute traderMode content script: ", error);
// }

// document.getElementById("traderToggle").onchange = function () {
//   setValue(!isOn);
// };

// document.getElementById("traderButton").onclick = function () {
//   browser.tabs
//     .executeScript({ file: "/src/content_scripts/instantBuy.js" })
//     .catch(console.log);
// };

// init().catch((e) => console.log("ERROR:\n" + e));
