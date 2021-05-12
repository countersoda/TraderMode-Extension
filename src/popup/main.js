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
var isOn;
var isRage;
myStorage = browser.storage.local;

const fetch = require("node-fetch");

const waxioURL = "https://wax.greymass.com/v1/history/get_actions";

const accountName = {
  account_name: "theonlykarma",
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

  if (!checkCookie() || !checkDonation()) {
    disableToggleButton();
    alertDonate();
  }
}

function alertDonate() {
  
}

function disableToggleButton() {
  document.querySelector("#traderCheckBox").setAttribute("disabled", true);
  document.querySelector("#rageCheckBox").setAttribute("disabled", true);
}

function initMemo(mem) {
  if (mem.memo === undefined) {
    setSeed(random());
  } else {
    setSeed(mem.memo.seed);
  }
  console.log(memo.seed);
}

function initTradeButton(item) {
  value = item.buttonOn.value;
  document.querySelector("#traderCheckBox").checked = value;
  if (value === undefined) {
    setToggle(false);
  } else {
    setToggle(value);
  }
}

function initRageButton(item) {
  value = item.rageOn.value;
  document.querySelector("#rageCheckBox").checked = value;
  if (value === undefined) {
    setRage(false);
  } else {
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
        cookie = getting.value;
        break;
      }
    }
    console.log("Exist cookie: ", !(cookie === undefined));
    console.log(cookie);
    return cookie === undefined;
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
  return false;
}

async function setSeed(seed) {
  memo.seed = seed;
  myStorage.set({ memo });
}
async function setToggle(value) {
  isOn = value;
  buttonOn.value = value;
  myStorage.set({ buttonOn });

  if (isOn) {
    setRage(false);
    document.querySelector("#rageCheckBox").checked = false;
  }
}

async function setRage(value) {
  isRage = value;
  rageOn.value = value;
  myStorage.set({ rageOn });

  if (isRage) {
    setToggle(false);
    document.querySelector("#traderCheckBox").checked = false;
  }
}

document.getElementById("traderToggle").onchange = function () {
  setToggle(!isOn);
};

document.getElementById("rageToggle").onchange = function () {
  setRage(!isRage);
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

},{"node-fetch":1}]},{},[2]);
