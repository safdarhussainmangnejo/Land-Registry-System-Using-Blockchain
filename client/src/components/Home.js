import React from "react";
import {Grid,Box,Button,InputLabel} from '@material-ui/core'
import { LandInspectorDashboard } from "./LandInspectorDashboard";
import SellerHomeScreen from "./SellerHomeScreen";
import BuyerHomeScreen from "./BuyerHomeScreen";

function Home({web3}) {
  return<>
    <div>

        <Grid container spacing={3} style={{paddingTop:100,paddingRight:20,paddingLeft:20,textAlign:"center"}} >
            
            <Grid item xs={4}>
                   <LandInspectorDashboard web3={web3}/>
            </Grid>
            <Grid item xs={4}>
                   <BuyerHomeScreen web3={web3}/>
            </Grid>
        </Grid>
    </div>
  </>
}

export default Home;
