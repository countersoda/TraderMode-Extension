console.log("Enter background scripts");
// run().error(console.log);
var counter = 0;

setTimeout(function () {
  clickBuyBtn();
}, 1500);

async function clickBuyBtn() {
  if (counter > 100) return;
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
