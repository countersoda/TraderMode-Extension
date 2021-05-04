/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.beastify-image) {
  display: none;
}`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function isTraderModeOn() {
  console.log("Here!");
  var checkedValue = document.querySelector(".input:checked").value;
  console.log(checkedValue)
};
/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
};

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
document.getElementById("traderToggle").onclick = function() {
  addListener
  console.log('Hello')
};


browser.tabs
  // .executeScript({ file: "/content_scripts/traderMode.js" })
  .then(isTraderModeOn)
  .catch(reportExecuteScriptError);
