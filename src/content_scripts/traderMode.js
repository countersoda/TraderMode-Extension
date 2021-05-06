console.log("Enter background scripts, test");
check().error(console.log);

async function check() {
  console.log('Check entered');
  console.log(window.console.log('Was geht')); //confirm-cooldown => Button um zum Wallet zu kommen
  console.log('Check after')
}


function remove() {
  try {
    document.getElementById("pagelet_ego_pane_w").innerHTML = "";
  } catch (err) {
    //Skip if "pagelet_ego_pane_w" div tag isn't on this page
  }
  try {
    document.getElementById("pagelet_ego_pane").innerHTML = "";
  } catch (err) {
    //Skip if "pagelet_ego_pane" div tag isn't on this page
  }
  try {
    document.getElementById("pagelet_side_ads").innerHTML = "";
  } catch (err) {
    //Skip if "pagelet_side_ads" div tag isn't on this page
  }
  try {
    document.getElementById("fbPhotoSnowliftAdsSide").innerHTML = "";
  } catch (err) {
    //Skip if "fbPhotoSnowliftAdsSide" div tag isn't on this page
  }
  console.log("All ads have been removed.");
  //   setTimeout(function () {
  //     remove();
  //   }, 2000);
}
remove();
