var isOn;
var isRage;
myStorage = browser.storage.local;

let buttonOn = {
  value: false,
};

let rageOn = {
  value: false,
};

async function init() {
  var value;
  myStorage
    .get("buttonOn")
    .then((item) => {
      value = item.buttonOn.value;
      document.querySelector("#traderCheckBox").checked = value;
      if (value === undefined) {
        setToggle(false);
      } else {
        setToggle(value);
        if (value) {
          send("init");
        }
      }
    })
    .catch(console.log);
  myStorage
    .get("rageOn")
    .then((item) => {
      value = item.rageOn.value;
      document.querySelector("#rageCheckBox").checked = value;
      if (value === undefined) {
        setRage(false);
      } else {
        setRage(value);
        if (value) {
          document.querySelector("#traderCheckBox").checked = !value;
          setToggle(false);
          send("rage");
        }
      }
    })
    .catch(console.log);
}

async function setToggle(value) {
  isOn = value;
  buttonOn.value = value;
  myStorage.set({ buttonOn });

  if(isOn){
    setRage(false)
    document.querySelector("#rageCheckBox").checked = false;
  }
}

async function setRage(value) {
  isRage = value;
  rageOn.value = value;
  myStorage.set({ rageOn });

  if(isRage){
    setToggle(false)
    document.querySelector("#traderCheckBox").checked = false;
  }
}

function send(message) {
  browser.tabs.query({ currentWindow: true }).then((tabs) => {
    for (let i = 0; i < tabs.length; i++) {
      browser.tabs
        .sendMessage(tabs[i].id, { command: message })
        .catch(console.log);
    }
  });
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

document.getElementById("traderButton").onclick = function () {
  send("buy");
  browser.tabs
    .executeScript({ file: "/src/content_scripts/instantBuy.js" })
    .catch(console.log);
};

init().catch((e) => console.log("ERROR:\n" + e));
