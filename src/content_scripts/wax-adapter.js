const fetch = require("node-fetch");

// const body = {
//   block_num_or_id: "118561703",
// };
//
// const communityURL = "https://wax.dfuse.eosnation.io/v1/chain/get_block";
//
// fetch(communityURL, {
//   method: "post",
//   body: JSON.stringify(body),
// })
//   .then((val) => val.json())
//   .then((val) => printTransactions(val.transactions));

// function printTransactions(transactions) {
//   for (let i = 0; i < transactions.length; i++) {
//     // console.log(transactions[i].trx);
//     let trx = transactions[i].trx;
//     if (trx.transaction !== undefined) {
//       let actions = trx.transaction.actions;
//       for (let j = 0; j < actions.length; j++) {
//         // console.log(actions[j].data);
//       }
//     }
//   }
// }

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
