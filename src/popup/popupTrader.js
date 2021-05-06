var isOn;
myStorage = window.localStorage;

async function setValue(value) {
  isOn = value;
  myStorage.setItem("value", value);
}

async function init() {
  var value = myStorage.getItem("value");
  bVal = value === "true" ? true : false;
  document.querySelector("#traderCheckBox").checked = bVal;
  if (value === undefined) {
    isOn = false;
    setValue(isOn);
  }
  setValue(bVal);
}

init().catch((e) => console.log("ERROR:\n" + e));

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  // document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.log("Failed to execute traderMode content script: ", error);
}

document.getElementById("traderToggle").onchange = function () {
  setValue(!isOn);
};

async function traderOn() {
  if (isOn !== undefined && isOn) {
    browser.tabs
      .executeScript({ file: "/src/content_scripts/instantBuy.js" })
      .catch(reportExecuteScriptError);
  }
}

document.getElementById("traderButton").onclick = function () {
  traderOn().catch(console.log);
};

traderOn().catch(console.log);
