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
    console.log("Cookie created!");
    createCookie("Eligible Cookie", "donated", true, 7);
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
  let result = await fetch(waxioURL, {
    headers: {
      account: accountName.account_name,
    },
  })
    .then((val) => val.json())
    .then((val) => {
      if (val !== undefined) hasSendSeed(val);
    });
  return true;
}

function hasSendSeed(raw_actions) {
  //Set to false, for test purposes its set to true
  return true;
}

async function createCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
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

},{"node-fetch":1}]},{},[2]);
