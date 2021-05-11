const fetch = require("node-fetch");

const waxioURL = "https://wax.greymass.com/v1/history/get_actions";

const accountName = {
  account_name: "theonlykarma",
};

fetch(waxioURL, {
  method: "post",
  body: JSON.stringify(accountName),
})
  .then((val) => val.json())
  .then(printActions);

function printActions(raw_actions) {
  let actions = raw_actions.actions;
  for (let i = 0; i < actions.length; i++) {
    let trace = actions[i].action_trace;
    if (trace !== undefined) {
      console.log(trace.block_time);
      console.log(trace.act.data.memo);
    }
  }
}
