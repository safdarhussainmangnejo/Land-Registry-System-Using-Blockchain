import { Grid } from "@material-ui/core";
import React from "react";
import AvailbleToBuy from "./AvailbleToBuy";
import GetBalanceInAccount from "./GetBalanceInAccount";

export default function BuyerDashBoard({web3}) {
  return (
    <div>
      <div>{localStorage.getItem("accountAddress")}</div>
      <GetBalanceInAccount web3={web3} sellerAccountAddress={localStorage.getItem("accountAddress")}/>
    <Grid container>
      <Grid item xs={12}>
        {/* List of availble to buy */}
        <AvailbleToBuy web3={web3}/>
      </Grid>

    </Grid>
    </div>
  );
}
