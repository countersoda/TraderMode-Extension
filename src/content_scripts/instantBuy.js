console.log("Enter content scripts");
var counter = 0;
console.log("Counter" + counter);
myStorage = browser.storage.local;

myStorage.get("buttonOn").then((value) => {
  if (value.buttonOn.value) {
    setTimeout(() => clickBuyBtn(), 800);
  }
});

myStorage.get("rageOn").then((value) => {
  console.log("Rage: " + value.rageOn.value);
  if (value.rageOn.value) {
    setTimeout(() => clickBuyBtn(), 800);
    setTimeout(() => dapperBuyBtn(), 2000);
  }
});

instant().catch(console.log);

function instant() {
  browser.runtime.onMessage.addListener((request) => {
    console.log("Request: " + request.command);
    console.log("Equal rage = " + request.command === "rage");
    if (request.command === "buy") {
      clickBuyBtn();
    } else if (request.command === "rage") {
      setTimeout(() => dapperBuyBtn(), 800);
    }
    return true;
  });
}

async function clickBuyBtn() {
  if (counter++ > 50) return;
  var buyBtn = await window.document.getElementsByClassName(
    "ButtonBase__StyledButton-sc-1qgxh2e-0 gjCpfL Button__StyledButton-ig3kkl-1 fXrqGh"
  );
  if (buyBtn[0] !== undefined) {
    buyBtn[0].click();
    clickConfirmBtn();
  } else {
    setTimeout(function () {
      clickBuyBtn();
    }, 0.0001 * 1000);

    console.log("Buy button is not available\nTrying again...");
  }
}

async function clickConfirmBtn() {
  var confirmBtn = await window.document.getElementsByClassName(
    "ButtonBase__StyledButton-sc-1qgxh2e-0 gjCpfL Button__StyledButton-ig3kkl-1 GJBBL"
  );
  if (confirmBtn[0] !== undefined) {
    confirmBtn[0].click();
    confirmClicked = true;
    counter = 0;
  } else {
    setTimeout(clickConfirmBtn, 0.0001 * 1000);
    console.log("Confirm button is not available\nTrying again...");
  }
}

async function dapperBuyBtn() {
  console.log("Enter Dapper Function");
  if (counter++ > 50) return;
  
  var buyBtn = await window.document.getElementsByClassName("css-ftq8xn");
  if (buyBtn[0] !== undefined) {
    console.log("Dapper button found");
    buyBtn[0].click();
  } else {
    setTimeout(function () {
      dapperBuyBtn();
    }, 0.0001 * 1000);
    console.log("Dapper button is not available\nTrying again...");
  }
}
