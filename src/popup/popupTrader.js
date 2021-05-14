myStorage = browser.storage.local;

const fetch = require("node-fetch");

fst = "https://wax.eosrio.io/v2/history/get_actions?&skip=";
snd = "&account=k.mr2.wam&limit=100";

var buttonOn = {
  value: false,
};

var rageOn = {
  value: false,
};

var memo = {
  seed: "",
};

async function getSeed() {
  return await myStorage.get("memo").then((val) => {
    return val.memo;
  });
}

const random = (length = 10) => {
  return Math.random().toString(16).substr(2, length);
};

async function init() {
  myStorage.get("buttonOn").then(initTradeButton).catch(console.log);
  myStorage.get("rageOn").then(initRageButton).catch(console.log);
  myStorage.get("memo").then(initMemo).catch(console.log);

  let hasDonated = await checkDonation();

  console.log("Has donated: ", hasDonated);

  if (!hasDonated) {
    disableToggleButton();
    alertDonate();
  }
}

function alertDonate() {}

function disableToggleButton() {
  setToggle(false);
  setRage(false);

  document.querySelector("#traderCheckBox").setAttribute("disabled", true);
  document.querySelector("#rageCheckBox").setAttribute("disabled", true);
}

// function enableToggleButton() {
//   document.querySelector("#traderCheckBox").setAttribute("disabled", false);
//   document.querySelector("#rageCheckBox").setAttribute("disabled", false);
// }

//TODO Init text area for memo
function initMemo(mem) {
  if (mem.memo === undefined || mem.memo.seed === undefined) {
    setSeed(random());
  } else {
    setSeed(mem.memo.seed);
  }
  document.querySelector("#waxText").textContent = memo.seed;
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
    let value = item.rageOn.value;
    document.querySelector("#rageCheckBox").checked = value;
    setRage(value);
    if (value) {
      document.querySelector("#traderCheckBox").checked = !value;
      setToggle(false);
    }
  }
}

async function checkDonation() {
  let skip = 0;
  let search = true;
  let timeout = false;
  let memo = await getSeed();
  let till = new Date();

  till.setTime(till.getTime() - 7 * 24 * 60 * 60 * 1000);

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
    if (till.getTime() > new Date(actions[i].timestamp).getTime()) {
      return [true, true];
    }
    if (
      trace !== undefined &&
      trace.data !== null &&
      trace.data.memo === memo.seed
    ) {
      return [false, false];
    }
  }
  return [true, false];
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

init().catch(console.log);
