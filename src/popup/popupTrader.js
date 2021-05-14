myStorage = browser.storage.local;

const fetch = require("node-fetch");

const waxioURL =
  "https://wax.eosrio.io/v2/history/get_actions?&skip=75&account=k.mr2.wam&limit=50&before=2021-05-12T07%3A59%3A20.580Z";

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

  console.log("Cookie is: ", await checkCookie());
  console.log("Donation is: ", await checkDonation());

  if (!(await checkCookie()) || !(await checkDonation())) {
    disableToggleButton();
    alertDonate();
  }
  if (!(await checkCookie()) && (await checkDonation())) {
    enableToggleButton();
    console.log("Cookie created!");
    createCookie("Eligible Cookie", "donated", true);
  }
}

function alertDonate() {}

function disableToggleButton() {
  setToggle(false);
  setRage(false);

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
  if (item.buttonOn === undefined) {
    setToggle(false);
  } else {
    value = item.buttonOn.value;
    document.querySelector("#traderCheckBox").checked = value;
    setToggle(value);
  }
}

function initRageButton(item) {
  if (item.rageOn === undefined) {
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

async function checkCookie() {
  let cookies = await browser.cookies.getAll({
    name: "Eligible Cookie",
  });
  return cookies.length > 0;
}

async function checkDonation() {
  skip = 0;
  actions = {};
  search = true;
  timeout = false;
  memo = "sale";
  till = new Date();
  till.setTime(till.getTime() - 7 * 24 * 60 * 60 * 1000);
  console.log(till);
  while (search && !timeout) {
    url = fst + skip + snd;
    var result = await fetch(url).then((val) => val.json());
    [search, timeout] = getActions(result, memo, till);
    skip += 100;
  }
  return !search;
}

function getActions(raw_actions, memo, till) {
  let actions = raw_actions.actions;
  for (let i = 0; i < actions.length; i++) {
    let trace = actions[i].act;
    // console.log(actions[i].timestamp);
    if (till.getTime() > new Date(actions[i].timestamp).getTime()) {
      return [true, true];
    }
    if (
      trace !== undefined &&
      trace.data !== null &&
      trace.data.memo === memo
    ) {
      return [false, false];
    }
  }
  return [true, false];
}

async function createCookie(name, value) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    expires = date.toGMTString();
  } else {
    expires = "";
  }
  console.log(expires);

  browser.cookies.set({
    url: "https://nbatopshot.com/",
    name: name,
    value: value,
    expirationDate: date.getTime(),
  });
}

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

// document.getElementById("donateButton").onclick = function () {
//   if (checkDonation) {
//     enableToggleButton();
//     createCookie();
//   }
// };

init().catch((e) => console.log("ERROR:\n" + e));
