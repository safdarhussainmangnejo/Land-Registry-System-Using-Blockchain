import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { InputLabel, TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import LandRecordsContract from "../contracts/LandRecords.json";

import GetBalanceInAccount from "./GetBalanceInAccount";
import ListOfPendingLands from "./ListOfPendingLands";
import ListOfPurchasedLands from "./ListOfPurchasedLands";

export default function SellerDashboard({ web3 }) {
  const [landRecordsContrat, setLandRecordContract] = useState(null);

  const [sellerName, setSellerName] = useState();
  const [sellerAccountAddress, setSellerAccountAddress] = useState();
  const [price, setPrice] = useState();
  const [landDetails, setLandDetails] = useState();
  const [accountPin, setAccountPin] = useState();
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
    setSellerName(localStorage.getItem("name"));
    setSellerAccountAddress(localStorage.getItem("accountAddress"));
  }, []);

  const handleSell = () => {
    //
    const storeData = async () => {
      // function registerForSelling(string memory id,string memory sellerName,string memory sellerAccountAddress,
      //   string memory sellingPrice,string memory landDetails
      //   ) public {

      const id = await landRecordsContrat.methods
        .getAllLandRecordsCount()
        .call();
      web3.eth.personal
        .unlockAccount(sellerAccountAddress, accountPin, 5000)
        .then((data) => {
          const store = async () => {
            console.log(sellerName)
            const response = await landRecordsContrat.methods
              .registerForSelling(
                id,
                sellerName,
                sellerAccountAddress,
                price,
                landDetails
              )
              .send({ from: sellerAccountAddress })
              .catch((error) => {
                alert(error.message);
              });

            if (response) {
              console.log(response);
              alert("Added for selling");
              window.location.reload();
            }
          };

          store();
        });
    };
    storeData();
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
          <InputLabel
            style={{ fontSize: 40, marginTop: "5%", marginLeft: "5%" }}
          >{`Welcome : ${sellerName}`}</InputLabel>
        </Grid>
        <Grid item xs={6} style={{ textAlign: "right", marginTop: "2%" }}>
          <GetBalanceInAccount
            web3={web3}
            sellerAccountAddress={sellerAccountAddress}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4} style={{ paddingLeft: 20 }}>
          <div>
            <TextField
              id="outlined-basic"
              style={{ width: 350, marginTop: "5%" }}
              label="Seller Name"
              variant="outlined"
              value={sellerName}
              onChange={(e) => {
                setSellerName(e.target.value);
              }}
            />
          </div>
          <div>
            <TextField
              id="outlined-basic"
              style={{ width: 350, marginTop: "5%" }}
              label="Seller Name"
              variant="outlined"
              value={sellerAccountAddress}
              onChange={(e) => {
                setSellerAccountAddress(e.target.value);
              }}
            />
          </div>
          <div>
            <TextField
              id="outlined-basic"
              style={{ width: 350, marginTop: "5%" }}
              label="Price"
              variant="outlined"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </div>
          <div>
            <TextField
              id="outlined-basic"
              style={{ width: 350, marginTop: "5%" }}
              label="Details"
              variant="outlined"
              value={landDetails}
              onChange={(e) => {
                setLandDetails(e.target.value);
              }}
            />
          </div>
          <div>
            <TextField
              id="outlined-basic"
              style={{ width: 350, marginTop: "5%" }}
              label="Account pin"
              variant="outlined"
              value={accountPin}
              onChange={(e) => {
                setAccountPin(e.target.value);
              }}
            />
          </div>
          <div>
            <Button
              onClick={handleSell}
              style={{ marginTop: "7%" }}
              variant="contained"
              color="primary"
            >
              Sell
            </Button>
          </div>
        </Grid>
        <Grid item xs={4}>
          <ListOfPendingLands web3={web3} landRecordsContrat={landRecordsContrat} sellerAccountAddress={sellerAccountAddress}/>
        </Grid>
        <Grid item xs={4}>
          <ListOfPurchasedLands web3={web3} landRecordsContrat={landRecordsContrat} sellerAccountAddress={sellerAccountAddress}/>
        </Grid>
      </Grid>
    </div>
  );
}
