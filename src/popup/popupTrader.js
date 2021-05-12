myStorage = browser.storage.local;

const fetch = require("node-fetch");

const waxioURL = "https://wax.greymass.com/v1/history/get_actions";

const accountName = {
  account_name: "k.mr2.wam",
};

var buttonOn = {
  value: false,
};

var rageOn = {
  value: false,
};

var memo = {
  seed: "",
};

var getTabs = browser.tabs.query({
  currentWindow: true,
});

const random = (length = 10) => {
  return Math.random().toString(16).substr(2, length);
};

async function init() {
  myStorage.get("buttonOn").then(initTradeButton).catch(console.log);
  myStorage.get("rageOn").then(initRageButton).catch(console.log);
  myStorage.get("memo").then(initMemo).catch(console.log);
  console.log("Cookie is: ", checkCookie());
  console.log("Donation is: ", checkDonation());
  if (!checkCookie() || !checkDonation()) {
    disableToggleButton();
    alertDonate();
  }
  if (checkDonation && !checkCookie()) {
    createCookie("Eligible Cookie", "Eligible Cookie", true, 7);
  }
}

function alertDonate() {}

function disableToggleButton() {
  document.querySelector("#traderCheckBox").setAttribute("disabled", true);
  document.querySelector("#rageCheckBox").setAttribute("disabled", true);
}
function enableToggleButton() {
  document.querySelector("#traderCheckBox").setAttribute("disabled", false);
  document.querySelector("#rageCheckBox").setAttribute("disabled", false);
}

//TODO Init text area for memo
function initMemo(mem) {
  if (mem.memo === undefined) {
    setSeed(random());
  } else {
    setSeed(mem.memo.seed);
  }
  console.log(memo.seed);
}

function initTradeButton(item) {
  if (item === undefined) {
    setToggle(false);
  } else {
    value = item.buttonOn.value;
    document.querySelector("#traderCheckBox").checked = value;
    setToggle(value);
  }
}

function initRageButton(item) {
  if (item === undefined) {
    setRage(false);
  } else {
    value = item.rageOn.value;
    document.querySelector("#rageCheckBox").checked = value;
    setRage(value);
    if (value) {
      document.querySelector("#traderCheckBox").checked = !value;
      setToggle(false);
    }
  }
}

function checkCookie() {
  getTabs.then((tabs) => {
    var cookie = undefined;
    for (let i = 0; i < tabs.length; i++) {
      var getting = browser.cookies.get({
        url: tabs[i].url,
        name: "Eligible Cookie",
      });
      if (getting) {
        console.log(getting);
        cookie = getting.value;
        break;
      }
    }
    console.log("Exist cookie: ", !(cookie === undefined));
    // console.log(cookie);
    return true; //cookie === undefined;
  });
}

async function checkDonation() {
  let result = await fetch(waxioURL, {
    method: "post",
    body: JSON.stringify(accountName),
  })
    .then((val) => val.json())
    .then(hasSendSeed);
  console.log("Check donation: ", result);
  return result;
}

function hasSendSeed(raw_actions) {
  let actions = raw_actions.actions;
  for (let i = 0; i < actions.length; i++) {
    let trace = actions[i].action_trace;
    let waxMemo = trace.act.data.memo;
    if (trace !== undefined && waxMemo === memo.seed) {
      return true;
    }
  }
  //Set to false, for test purposes its set to true
  return true;
}

function createCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function setCookie() {}

async function setSeed(seed) {
  memo.seed = seed;
  myStorage.set({ memo });
}

async function setToggle(value) {
  isOn = value;
  buttonOn.value = value;
  myStorage.set({ buttonOn });
  document.querySelector("#traderCheckBox").checked = value;
  if (isOn) setRage(false);
}

async function setRage(value) {
  isRage = value;
  rageOn.value = value;
  myStorage.set({ rageOn });
  document.querySelector("#rageCheckBox").checked = value;
  if (isRage) setToggle(false);
}

document.getElementById("traderToggle").onchange = function () {
  setToggle(!isOn);
};

document.getElementById("rageToggle").onchange = function () {
  setRage(!isRage);
};

document.getElementById("donateButton").onclick = function () {
  if (checkDonation) {
    enableToggleButton();
    setCookie();
  }
};

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#error-content").classList.remove("hidden");
  console.log("Failed to execute traderMode content script: ", error);
}

init().catch((e) => console.log("ERROR:\n" + e));
