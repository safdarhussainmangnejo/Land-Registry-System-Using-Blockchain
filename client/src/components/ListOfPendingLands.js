import { InputLabel } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";

export default function ListOfPendingLands({ web3, landRecordsContrat,sellerAccountAddress}) {
  const [landRecords,setLandRecords]=useState([]);
    useEffect(() => {
    if (web3 && landRecordsContrat) {
      //load
      const loadData = async () => {
        let records =[];
        const id = await landRecordsContrat.methods
          .getAllLandRecordsCount()
          .call();
        console.log(id);
        for (let i = 0; i < id; i++) {
          const resp = await landRecordsContrat.methods
            .getLandDetails(i+"")
            .call();
        //   console.log(resp);
          if(sellerAccountAddress==resp.sellerAccountAddress && resp.buyerAccountAddress=="" )
          records.push({
            sellingPrice:resp.sellingPrice,
            landDetails:resp.landDetails,
            isApproved:resp.isApproved
          })
          
        }
        setLandRecords(records)
      };
      loadData();
    }
  }, [web3, landRecordsContrat]);
  console.log(landRecords)
  return <div style={{padding:30}} >
     <div>
         <InputLabel style={{paddingBottom:10}}>List of approved and pending land</InputLabel>
     </div>
      {landRecords.map((item)=>{
          return <Grid container    >
              <Grid item xs={4}>
              Price : {item.sellingPrice}
              </Grid>
              <Grid item xs={4}>
              Details : {item.landDetails}
              </Grid>
              <Grid item xs={4}>
                {`Is Approved : ${item.isApproved}`}
              </Grid>
          </Grid>
      })}
  </div>;
}
