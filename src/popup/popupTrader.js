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

var timestamp = {
  date: -1,
};

const random = (length = 10) => {
  return Math.random().toString(16).substr(2, length);
};

async function init() {
  myStorage.get("buttonOn").then(initTradeButton).catch(console.log);
  myStorage.get("rageOn").then(initRageButton).catch(console.log);
  myStorage.get("memo").then(initMemo).catch(console.log);
  myStorage.get("timestamp").then(initTimestamp).catch(console.log);

  let hasDonated = await checkDonation();

  if (!hasDonated) {
    disableToggleButton();
    alertDonate();
  } else {
    enableToggleButton();
    document.getElementById("alertDonate").style.visibility = "hidden";
  }
}

function alertDonate() {
  document.getElementById("alertDonate").style.visibility = "visible";
}

function disableToggleButton() {
  setToggle(false);
  setRage(false);
  document.querySelector("#traderCheckBox").setAttribute("disabled", true);
  document.querySelector("#rageCheckBox").setAttribute("disabled", true);
}

function enableToggleButton() {
  document.querySelector("#traderCheckBox").setAttribute("enabled", true);
  document.querySelector("#rageCheckBox").setAttribute("endabled", true);
}

function initTimestamp(time) {
  if (time.timestamp === undefined || time.timestamp.date === undefined) {
    alertDonate();
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
      new String(trace.data.memo)
        .replace("\n", "")
        .replace("\n", "")
        .localeCompare(new String(memo.seed))
    ) {
      setTime(new Date(actions[i].timestamp).getTime());
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
    return new Date().getTime();
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
  // Get today's date and time
  var now = new Date().getTime();
  var week = 7 * 24 * 60 * 60 * 1000;
  // Find the distance between now and the count down date
  var date = await getTime();
  var distance = week - (now - date);
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("countdown").innerHTML =
    days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    // clearInterval(x);
    document.getElementById("countdown").innerHTML = "";
  }
}, 1000);

init().catch(console.log);
