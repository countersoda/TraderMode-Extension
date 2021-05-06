var isOn;
myStorage = window.localStorage;

async function setValue(value) {
  isOn = value;
  console.log("Is on ", isOn);
  myStorage.setItem("value", value);
}

async function init() {
  var value = myStorage.getItem("value");
  bVal = value === "true" ? true : false;
  console.log(value);
  if (value === undefined) {
    isOn = false;
    setValue(isOn);
  }
  document.querySelector("#traderCheckBox").checked = bVal;
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
  console.error(
    `Failed to execute traderMode content script: ${error.message}`
  );
}
/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
document.getElementById("traderToggle").onchange = function () {
  setValue(!isOn);
};

browser.tabs
  .executeScript({ file: "/src/content_scripts/traderMode.js" })
  .catch(reportExecuteScriptError);
