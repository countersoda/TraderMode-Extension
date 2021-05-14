const fetch = require("node-fetch");

const waxioURL =
  "https://wax.eosrio.io/v2/history/get_actions?&skip=0&account=k.mr2.wam&limit=100";

/**
 * https://wax.eosrio.io/v2/history/get_actions?limit=50&account=k.mr2.wam&before=2021-05-12T07%3A00%3A20.580Z
 * Beispiel URL
 * Wichtige Parameter:
 * account  = Accountname
 * limit    = Anzahl der Ausgaben
 * before   = Vor angegebener Zeit
 * skip     = Überspringen
 * ":" = %3A
 *
 * https://wax.eosrio.io/v2/docs/index.html#/
 */

const accountName = {
  account_name: "k.mr2.wam",
};

fst = "https://wax.eosrio.io/v2/history/get_actions?&skip=";
snd = "&account=k.mr2.wam&limit=100";

async function testFetch() {
  skip = 0;
  actions = {};
  found = false;
  while (!found) {
    url = fst + skip + snd;
    let result = await fetch(url).then((val) => val.json());
    found = getActions(result);
    skip += 100;
    console.log(result);
  }

  return result;
}

function getActions(raw_actions) {
  let actions = raw_actions.actions;
  // console.log(actions);
  for (let i = 0; i < actions.length; i++) {
    let trace = actions[i].act;
    // console.log(trace);
    // console.log(actions[i].timestamp);
    // if (trace !== undefined && trace.act.data !== null) {
    //   console.log(trace.block_time);
    //   console.log(trace.act);
    // }
  }
  // console.log(actions.length);
  return true;
}

testFetch();
