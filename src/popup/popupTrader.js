var isOn;
myStorage = window.localStorage;

async function init() {
  var value = myStorage.getItem("value");
  bVal = value === "true" ? true : false;
  document.querySelector("#traderCheckBox").checked = bVal;

  if (value === undefined) {
    setValue(false);
  } else {
    setValue(bVal);
    if (bVal) {
      sendingMessage();
    }
  }
}

async function setValue(value) {
  isOn = value;
  myStorage.setItem("value", value);
}

function sendingMessage() {
  var tabs = browser.tabs.query({
    currentWindow: true,
  });
  tabs.then(connectToTab);
}

function connectToTab(tabs) {
  let availablePort;
  for (let i = 0; i < tabs.length; i++) {
    var port = browser.tabs.connect(tabs[i].id, {
      name: "tabs-connect-example",
    });
    console.log(port)
    if (port !== undefined) availablePort = port;
  }
  availablePort.postMessage({ greeting: "Hi from background script" });
}

// function traderOn() {
//   if (isOn !== undefined && isOn) {
//     browser.tabs
//       .executeScript({ file: "/src/content_scripts/instantBuy.js" })
//       .catch(reportExecuteScriptError);
//   }
// }

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#error-content").classList.remove("hidden");
  console.log("Failed to execute traderMode content script: ", error);
}

document.getElementById("traderToggle").onchange = function () {
  setValue(!isOn);
};

document.getElementById("traderButton").onclick = function () {
  browser.tabs
    .executeScript({ file: "/src/content_scripts/instantBuy.js" })
    .catch(console.log);
};

init().catch((e) => console.log("ERROR:\n" + e));
