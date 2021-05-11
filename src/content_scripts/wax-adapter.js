const fetch = require("node-fetch");

body = {
  block_num_or_id: 25000000,
};

fetch("https://api.eosn.io/v1/chain/get_info", { method: 'post'
})
  .then((val) => val.json())
  .then(console.log);
