var isOn;
var isRage;
myStorage = browser.storage.local;

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

  if (!checkCookie()) {
    disableToggleButton();
  }
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
