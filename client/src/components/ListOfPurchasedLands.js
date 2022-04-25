import { InputLabel } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";

export default function ListOfPurchasedLands({ web3, landRecordsContrat,sellerAccountAddress}) {
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
          if(sellerAccountAddress==resp.sellerAccountAddress && resp.buyerName!="" )
          records.push({
            sellingPrice:resp.sellingPrice,
            landDetails:resp.landDetails,
            isApproved:resp.isApproved,
            buyerName:resp.buyerName,
            buyerAccountAddress:resp.buyerAccountAddress
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
              <Grid item xs={2}>
              Price : {item.sellingPrice}
              </Grid>
              <Grid item xs={2}>
              Details : {item.landDetails}
              </Grid>
              <Grid item xs={2}>
                {`Is Approved : ${item.isApproved}`}
              </Grid>
              <Grid item xs={2}>
                {`Buyer Name : ${item.buyerName}`}
              </Grid>
              <Grid item xs={2}>
                {`Buyer Address : ${item.buyerAccountAddress}`}
              </Grid>
          </Grid>
      })}
  </div>;
}
