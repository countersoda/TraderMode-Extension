var counter = 0;
var counterDapper = 0;

myStorage = browser.storage.local;

myStorage.get("buttonOn").then((value) => {
  if (value.buttonOn.value) {
    setTimeout(clickBuyBtn, 800);
  }
});

console.log("Enter script");
browser.cookies.getAll({}).then(console.log);

myStorage.get("rageOn").then(checkPageForRage);

function checkPageForRage(value) {
  let enteredDapper = window.location.href.includes(
    "https://accounts.meetdapper.com/checkout/"
  );
  if (value.rageOn.value && !enteredDapper) {
    setTimeout(clickBuyBtn, 800);
  } else if (value.rageOn.value && enteredDapper) {
    dapperBuyBtn();
  }
}

instant().catch(console.log);

function instant() {
  browser.runtime.onMessage.addListener((request) => {
    if (request.command === "buy") {
      clickBuyBtn();
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
    setTimeout(clickBuyBtn, 0.0001 * 1000);
  }
}

async function clickConfirmBtn() {
  var confirmBtn = await window.document.getElementsByClassName(
    "ButtonBase__StyledButton-sc-1qgxh2e-0 gjCpfL Button__StyledButton-ig3kkl-1 GJBBL"
  );
  if (confirmBtn[0] !== undefined) {
    confirmBtn[0].click();
  } else {
    setTimeout(clickConfirmBtn, 0.0001 * 1000);
  }
}

async function dapperBuyBtn() {
  if (counterDapper++ > 100) return;

  var buyBtn = await window.document.getElementsByClassName("css-ftq8xn");

  if (buyBtn[0] !== undefined) {
    buyBtn[0].click();
  } else {
    setTimeout(dapperBuyBtn, 0.0001 * 1000);
  }
}
