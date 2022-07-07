import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LandRecordsContract from "../contracts/LandRecords.json";

export default function Requests({ web3 }) {
  const [landRecords, setLandRecords] = useState([]);
  const [landRecordContract, setLandRecordContract] = useState();
  useEffect(() => {
    if (web3) {
      const getContractInstance = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = LandRecordsContract.networks[networkId];
        const instance = new web3.eth.Contract(
          LandRecordsContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setLandRecordContract(instance);
      };

      getContractInstance();
    }
  }, [web3]);

  useEffect(() => {
    if (web3 && landRecordContract) {
      //load
      const loadData = async () => {
        let records = [];
        const id = await landRecordContract.methods
          .getAllLandRecordsCount()
          .call();
        console.log(id);
        for (let i = 0; i < id; i++) {
          const resp = await landRecordContract.methods
            .getLandDetails(i + "")
            .call();
            console.log(resp);
          if (true)
            records.push({
              id:i,
              sellingPrice: resp.sellingPrice,
              landDetails: resp.landDetails,
              isApproved: resp.isApproved,
              sellerName:resp.sellerName,
              sellerAccountAddress:resp.sellerAccountAddress
            });
        }
        setLandRecords(records);
      };
      loadData();
    }
  }, [web3, landRecordContract]);

  console.log(landRecords);

  const handleApprove=(index)=>{
    const updateStatus=async()=>{
        const accounts = await web3.eth.getAccounts();
        const response = await landRecordContract.methods
        .updateAprrovalStatus(landRecords[index].id+"")
        .send({ from: accounts[0] })
        .catch((error) => {
          alert(error.message);
        });
        if(response){
            alert("Approved")
            window.location.reload();
        }
    }
    updateStatus();
  }
  return (
    <div>
      <div>Pending land requests</div>
      <div>
        {landRecords.map((item,index) => {
          return (
            <div style={{marginTop:"2%"}}>
              <Grid container>
                <Grid item xs={2}>
                  Seller : {item.sellerName}
                </Grid>    
                <Grid item xs={2}>
                  Seller AC Addr : {item.sellerAccountAddress}
                </Grid>    
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
                  <Button
                    onClick={(e)=>{
                        const index = landRecords.indexOf(item)
                        handleApprove(index);
                    }}
                    style={{ marginTop: "0" }}
                    variant="contained"
                    color= {item.isApproved?"primary":"error"}
                  >
                    {item.isApproved ?  "Approve" :"Not Approved "}
                  </Button>
                </Grid>
              </Grid>
            </div>
          );
        })}
      </div>
    </div>
  );
}
