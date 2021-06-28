(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
if (global.fetch) {
	exports.default = global.fetch.bind(global);
}

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
myStorage = browser.storage.local;

const fetch = require("node-fetch");

const API_URL = "https://wax.greymass.com/v1/history/get_actions";

var body = {
  account_name: "yznbq.wam",
  skip: 0,
  limit: 100,
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

var timestamp = {
  date: -1,
};

var isOn, isRage;

const weekVal = 7 * 24 * 60 * 60 * 1000;

const random = (length = 10) => {
  return Math.random().toString(16).substr(2, length);
};

async function init() {
  myStorage.get("memo").then(initMemo).catch(console.log);

  let hasDonated = await checkDonation();
  if (!hasDonated) {
    disableToggleButton();
    alertDonate();
    setTime(-1);
  } else {
    myStorage.get("timestamp").then(initTimestamp).catch(console.log);
    myStorage.get("buttonOn").then(initTradeButton).catch(console.log);
    myStorage.get("rageOn").then(initRageButton).catch(console.log);
    enableToggleButton();
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
    body.skip = skip;
    var result = await fetch(API_URL, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
      .then((val) => {
        return val.json();
      })
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

  for (let i = actions.length - 1; i > 0; i--) {
    let trace = actions[i].action_trace.act;
    if (till.getTime() > new Date(actions[i].block_time).getTime()) {
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
      setTime(new Date(actions[i].block_time).getTime() + 2 * 60 * 60 * 1000);
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

function setTime(time) {
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
  // Get today's date and time
  var now = new Date().getTime();
  var week = weekVal;
  // Find the distance between now and the count down date
  var date = await getTime();
  console.log(now > date);
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
    document.getElementById("status").textContent =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    document.getElementById("status").style.color = "#04df04";
  }
}, 1000);

init().catch(console.log);

},{"node-fetch":1}]},{},[2]);
