var isOn;
myStorage = browser.storage.local;

let buttonOn = {
  value: false,
};

async function init() {
  var value;
  myStorage
    .get("buttonOn")
    .then((item) => {
      value = item.buttonOn.value;
    })
    .catch(console.log);
  bVal = value === "true" ? true : false;
  document.querySelector("#traderCheckBox").checked = bVal;

  if (value === undefined) {
    setValue(false);
  } else {
    setValue(bVal);
    if (bVal) {
      send("init");
    }
  }
}

async function setValue(value) {
  isOn = value;
  buttonOn.value = value;
  myStorage.set({ buttonOn });
  console.log(buttonOn);
}

function send(message) {
  browser.tabs.query({ currentWindow: true }).then((tabs) => {
    for (let i = 0; i < tabs.length; i++) {
      browser.tabs
        .sendMessage(tabs[i].id, { command: message })
        .catch(console.log);
    }
  });
}

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
  send("buy");
  browser.tabs
    .executeScript({ file: "/src/content_scripts/instantBuy.js" })
    .catch(console.log);
};

init().catch((e) => console.log("ERROR:\n" + e));
