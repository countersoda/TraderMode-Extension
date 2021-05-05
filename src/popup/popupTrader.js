/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.beastify-image) {
  display: none;
}`;

var isOn;

async function setValue(value) {
  isOn = value;
  await browser.storage.local.set({ value });
  console.log(
    browser.storage.local.get("value").then((val) => console.log(val))
  );
}

async function init() {
  var value;
  browser.storage.local.get("value").then((val) => (value = val));
  if (!value) {
    isOn = false;
  }
  // console.log(browser.storage.local);
  setValue(isOn);
}

init().catch((e) => console.log(e));
/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
async function isTraderModeOn() {
  console.log("Here!");
  var checkedValue = await document.querySelector("input:checked").value;
  console.log("Checked value " + checkedValue);
}
/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
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

// browser.tabs
//   .executeScript({ file: "/src/content_scripts/traderMode.js" })
//   .then(isTraderModeOn)
//   .catch(reportExecuteScriptError);
