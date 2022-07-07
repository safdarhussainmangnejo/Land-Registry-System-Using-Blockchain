import { Button } from "@material-ui/core";
import { Grid, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LandRecordsContract from "../contracts/LandRecords.json";

export default function AvailbleToBuy({ web3 }) {
  const [buyerName, setBuyerName] = useState();
  const [buyerAccountAddress, setBuyerAccountAddress] = useState();

  const [landRecords, setLandRecords] = useState([]);
  const [landRecordContract, setLandRecordContract] = useState();

  const [accountPin, setAccountPin] = useState();

  useEffect(() => {
    const name = localStorage.getItem("name");
    const acd = localStorage.getItem("accountAddress");
    setBuyerAccountAddress(acd);
    setBuyerName(name);
  }, []);

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
          //   console.log(resp);
          if (resp.isApproved == true && resp.buyerName=="")
            records.push({
              id: i,
              sellingPrice: resp.sellingPrice,
              landDetails: resp.landDetails,
              isApproved: resp.isApproved,
              sellerName: resp.sellerName,
              sellerAccountAddress: resp.sellerAccountAddress,
            });
        }
        setLandRecords(records);
      };
      loadData();
    }
  }, [web3, landRecordContract]);

  console.log(landRecords);

  const handlePurchase = (index) => {
    const updateStatus = async () => {
      const accounts = await web3.eth.getAccounts();

      web3.eth
        .getTransactionCount(buyerAccountAddress, (err, txCount) => {
          //Got the transaction count.
          //unlocking account
          web3.eth.personal
            .unlockAccount(buyerAccountAddress, accountPin, 5000)
            .then(() => {
              //signing a transaction
              console.log("Unlocked account");
              web3.eth
                .signTransaction(
                  {
                    nonce: web3.utils.toHex(txCount),
                    from: buyerAccountAddress,
                    to: landRecords[index].sellerAccountAddress,
                    value: web3.utils.toHex(
                      web3.utils.toWei(landRecords[index].sellingPrice, "ether")
                    ),
                    gasLimit: web3.utils.toHex("21000"),
                    gasPrice: web3.utils.toHex(web3.utils.toWei("1", "gwei")),
                  },
                  accountPin
                )
                .then((signedTransaction) => {
                  //Sending signed transaction
                  console.log(signedTransaction.tx);
                  web3.eth.personal
                    .sendTransaction(
                      {
                        // nonce:    signedTransaction.tx.nonce,
                        from: buyerAccountAddress,
                        to: signedTransaction.tx.to,
                        value: signedTransaction.tx.value,
                        gasLimit: signedTransaction.tx.gasLimit,
                        gasPrice: signedTransaction.tx.gasPrice,
                        maxPriorityFeePerGas:
                          signedTransaction.tx.maxPriorityFeePerGas,
                        maxFeePerGas: signedTransaction.tx.maxFeePerGas,
                        gas: signedTransaction.tx.gas,
                        input: signedTransaction.tx.input,
                        v: signedTransaction.tx.input,
                        r: signedTransaction.tx.r,
                        s: signedTransaction.tx.s,
                        hash: signedTransaction.tx.hash,
                      },
                      accountPin
                    )
                    .then((txtHash) => {

                      const update=async()=>{
                        // function updatePurchaseDetails(string memory id,string memory buyerName,string memory buyerAccountAddress) public {
    
                        const response = await landRecordContract.methods
                        .updatePurchaseDetails(landRecords[index].id+"",buyerName,buyerAccountAddress)
                        .send({ from: buyerAccountAddress })
                        .catch((error) => {
                          alert(error.message);
                        });
                        if(response){
                            alert("Purchased")
                            window.location.reload();
                        }
                      }
                      update();

                      alert("Transfer done");

                      console.log({
                        responsePayload: true,
                        responseMessage:
                          "Amount: " +
                          landRecords[index].sellingPrice +
                          " sent from: " +
                          buyerAccountAddress +
                          " to: " +
                          landRecords[index].sellerAccountAddress +
                          " Since transaction hash is : " +
                          txtHash,
                        responseCode: 807,
                      });
                    })
                    .catch((error) => {
                      console.log(error.message);
                      console.log("Error in sending signed transactions..!");
                      alert(error.message)
                      console.log({
                        responsePayload: error.message,
                        responseMessage:
                          "Please provide enough gas  to process transaction",
                        responseCode: 818,
                      });
                    });
                })
                .catch((error) => {
                  console.log(error.message);
                  console.log("Error in siging transaction");
                });
            })
            .catch((error) => {
              console.log(error.message);
              console.log("Error in unlocking account");
              console.log({
                responsePayload: error.message,
                responseMessage:
                  "Plear provide your private key or check the reciver account address to unlock account and process transaction",
                responseCode: 818,
              });
            });
        })
        .catch((error) => {
          console.log(
            "Error in getting count of transactions aleardy done with this account."
          );
        });
    };
    updateStatus();
  };
  return (
    <div>
      <div>Availble To Buy </div>
      <div>
        <TextField
          id="outlined-basic"
          style={{ width: 150, marginTop: "5%" }}
          label="Account Pin"
          variant="outlined"
          onChange={(e) => {
            setAccountPin(e.target.value);
          }}
        />
      </div>
      <div>
        {landRecords.map((item, index) => {
          return (
            <div style={{ marginTop: "2%" }}>
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
                    onClick={(e) => {
                      const index = landRecords.indexOf(item);
                      handlePurchase(index);
                    }}
                    style={{ marginTop: "0" }}
                    variant="contained"
                    color="primary"
                  >
                    Buy
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
