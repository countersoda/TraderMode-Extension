const fetch = require("node-fetch");

const waxioURL = "https://wax.eosrio.io/v2/history/get_actions?&skip=75&account=k.mr2.wam&limit=50&before=2021-05-12T07%3A59%3A20.580Z";

/**
 * https://wax.eosrio.io/v2/history/get_actions?limit=50&account=k.mr2.wam&before=2021-05-12T07%3A00%3A20.580Z
 * Beispiel URL
 * Wichtige Parameter: 
 * account  = Accountname 
 * limit    = Anzahl der Ausgaben
 * before   = Vor angegebener Zeit
 * skip     = Überspringen
 * ":" = %3A
 */

const accountName = {
  account_name: "k.mr2.wam",
};
async function testFetch() {
  await fetch(waxioURL, {
    headers: {
      account: accountName.account_name,
    },
  })
    .then((val) => val.json())
    .then(printActions);
}

function printActions(raw_actions) {
  let actions = raw_actions.actions;
  // console.log(actions);
  for (let i = 0; i < actions.length; i++) {
    let trace = actions[i].act;
    console.log(trace);
    console.log(actions[i].timestamp)
    // if (trace !== undefined && trace.act.data !== null) {
    //   console.log(trace.block_time);
    //   console.log(trace.act);
    // }
  }
  console.log(actions.length)
  return true;
}

testFetch();
