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
  search = true;
  timeout = false;
  memo = "sale";
  till = new Date();
  till.setTime(till.getTime() - 7 * 24 * 60 * 60 * 1000);
  console.log(till);
  while (search && !timeout) {
    url = fst + skip + snd;
    var result = await fetch(url).then((val) => val.json());
    [search, timeout] = getActions(result, memo, till);
    skip += 100;
  }
  if (!search) {
    console.log("FOUND");
  }
  if (timeout) {
    console.log("NOT FOUND")
  }
  return result;
}

function getActions(raw_actions, memo, till) {
  let actions = raw_actions.actions;
  for (let i = 0; i < actions.length; i++) {
    let trace = actions[i].act;
    // console.log(actions[i].timestamp);
    if (till.getTime() > new Date(actions[i].timestamp).getTime()) {
      return [true, true];
    }
    if (
      trace !== undefined &&
      trace.data !== null &&
      trace.data.memo === memo
    ) {
      return [false, false];
    }
  }
  return [true, false];
}

testFetch();
