console.log("Enter content scripts");

var counter = 0;
var portFromBS;

browser.runtime.onConnect.addListener(connected)

function connected(p) {
  console.log('Connecting...')
  portFromBS = p;
  portFromBS.postMessage({greeting: "hi there content script!"});
  portFromBS.onMessage.addListener(function(m) {
    console.log("In background script, received message from content script")
    console.log(m.greeting);
  });
}

// init().catch(console.log);

function init() {
  browser.runtime.onMessage.addListener((request) => {
    console.log("Request: " + request.command);
    if (request.command === "init") {
      setTimeout(() => clickBuyBtn(), 1000);
    } else if (request.command === "buy") {
      clickBuyBtn();
    }
    return true;
  });
}

async function clickBuyBtn() {
  if (counter > 10) return;
  counter++;
  var buyBtn = await window.document.getElementsByClassName(
    "ButtonBase__StyledButton-sc-1qgxh2e-0 gjCpfL Button__StyledButton-ig3kkl-1 fXrqGh"
  );
  if (buyBtn[0] !== undefined) {
    buyBtn[0].click();
    setTimeout(function () {
      clickConfirmBtn();
    }, 0.0001 * 1000);
  } else {
    setTimeout(function () {
      clickBuyBtn();
    }, 500);

    console.log("Buy button is not available\nTrying again...");
  }
}

async function clickConfirmBtn() {
  var confirmBtn = await window.document.getElementsByClassName(
    "ButtonBase__StyledButton-sc-1qgxh2e-0 gjCpfL Button__StyledButton-ig3kkl-1 GJBBL"
  );
  if (confirmBtn[0] !== undefined) {
    confirmBtn[0].click();
  } else {
    setTimeout(function () {
      clickConfirmBtn();
    }, 0.0001 * 1000);
    console.log("Confirm button is not availableTrying again...");
  }
}
