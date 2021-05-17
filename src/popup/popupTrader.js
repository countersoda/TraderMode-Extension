myStorage = browser.storage.local;

const fetch = require("node-fetch");

const fst = "https://wax.eosrio.io/v2/history/get_actions?&skip=";
const snd = "&account=yznbq.wam&limit=100";

var buttonOn = {
  value: false,
};

var rageOn = {
  value: false,
};

var memo = {
  seed: "",
};

var timestamp = {
  date: -1,
};

const weekVal = 7 * 24 * 60 * 60 * 1000;

const random = (length = 10) => {
  return Math.random().toString(16).substr(2, length);
};

async function init() {
  disableToggleButton();
  myStorage.get("memo").then(initMemo).catch(console.log);

  let hasDonated = await checkDonation();
  if (!hasDonated) {
    alertDonate();
    setTime(-1);
  } else {
    enableToggleButton();
    myStorage.get("timestamp").then(initTimestamp).catch(console.log);
    myStorage.get("buttonOn").then(initTradeButton).catch(console.log);
    myStorage.get("rageOn").then(initRageButton).catch(console.log);
  }
}

function alertDonate() {
  document.getElementById("status").style = "visible";
  document.getElementById("status").innerHTML = "No donation found!";
}

function disableToggleButton() {
  setToggle(false);
  setRage(false);
  document.getElementById("traderCheckBox").disabled = true;
  document.getElementById("rageCheckBox").disabled = true;
}

function enableToggleButton() {
  document.getElementById("traderCheckBox").disabled = false;
  document.getElementById("rageCheckBox").disabled = false;
}

function initTimestamp(time) {
  if (time.timestamp === undefined || time.timestamp.date === undefined) {
    alertDonate();
    setTime(-1);
  } else {
    setTime(time.timestamp.date);
  }
}

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
  if (new Date().getTime() - (await getTime()) < weekVal) return true;
  let skip = 0;
  let search = true;
  let timeout = false;
  let memo = await getSeed();
  let till = new Date();

  till.setTime(till.getTime() - weekVal); //7 * 24 * 60 * 60 * 1000

  while (search && !timeout) {
    url = fst + skip + snd;
    var result = await fetch(url)
      .then((val) => val.json())
      .catch((e) => {
        console.log(e);
        alertDonate();
      });
    [search, timeout] = getActions(result, memo, till);
    skip += 100;
  }

  return !search;
}

function getActions(raw_actions, memo, till) {
  let actions = raw_actions.actions;
  if (actions.length === 0) return [true, true];
  for (let i = 0; i < actions.length; i++) {
    let trace = actions[i].act;
    if (till.getTime() > new Date(actions[i].timestamp).getTime()) {
      return [true, true];
    }
    if (
      trace !== undefined &&
      trace.data !== null &&
      new String(trace.data.memo)
        .replace("\n", "")
        .replace("\n", "")
        .localeCompare(new String(memo.seed)) === 0
    ) {
      setTime(new Date(actions[i].timestamp).getTime() + 2 * 60 * 60 * 1000);
      return [false, false];
    }
  }
  return [true, false];
}

async function setSeed(seed) {
  memo.seed = seed;
  myStorage.set({ memo });
}

async function getSeed() {
  return await myStorage.get("memo").then((val) => {
    return val.memo;
  });
}

async function setTime(time) {
  timestamp.date = time;
  myStorage.set({ timestamp });
}

async function getTime() {
  return await myStorage.get("timestamp").then((val) => {
    if (val.timestamp) return val.timestamp.date;
    return null;
  });
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

// Update the count down every 1 second
setInterval(async function () {
  if (now - date > weekVal) return;
  // Get today's date and time
  var now = new Date().getTime();
  var week = weekVal;
  // Find the distance between now and the count down date
  var date = await getTime();
  var distance = week - (now - date);
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // If the count down is finished, write some text
  if (distance < 0) {
    alertDonate();
  } else {
    document.getElementById("status").innerHTML =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    document.getElementById("status").style.color = "#04df04";
  }
}, 1000);

init().catch(console.log);
