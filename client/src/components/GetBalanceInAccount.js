import React, { useEffect, useState } from "react";
import { Grid, Box, Button, InputLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function GetBalanceInAccount({ web3,sellerAccountAddress}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    setToAccount(sellerAccountAddress)
  },[])

  useEffect(()=>{
    getBlaance()
  

  },[web3])


  const getBlaance=()=>{
    if(web3){
      if(sellerAccountAddress!=undefined){

      
      web3.eth.getBalance(sellerAccountAddress)
      .then((data)=>{
        console.log(data)
       const val = web3.utils.fromWei(data, 'ether')
        setBalance(val)
      })}
  }}

  const [fromAccount, setFromAccount] = useState();
  const [toAccount, setToAccount] = useState();
  const [ammount, setAmmount] = useState();
  const [accountPin, setAccountPin] = useState();

  const [balance,setBalance]=useState(0);
  const handleTransfer = () => {
    web3.eth
      .getTransactionCount(fromAccount, (err, txCount) => {
        //Got the transaction count.
        //unlocking account
        web3.eth.personal
          .unlockAccount(fromAccount, accountPin, 5000)
          .then(() => {
            //signing a transaction
            console.log("Unlocked account")
            web3.eth
              .signTransaction(
                {
                  nonce: web3.utils.toHex(txCount),
                  from: fromAccount,
                  to: toAccount,
                  value: web3.utils.toHex(web3.utils.toWei(ammount, "ether")),
                  gasLimit: web3.utils.toHex('21000'),
                  gasPrice: web3.utils.toHex(
                    web3.utils.toWei("1", "gwei")
                  ),
                },
                accountPin
              )
              .then((signedTransaction) => {
                //Sending signed transaction
                console.log(signedTransaction.tx)
                web3.eth.personal
                  .sendTransaction(
                    {
                      // nonce:    signedTransaction.tx.nonce,
                      from: fromAccount,
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
                    alert("Transfer done")
                    console.log({
                      responsePayload: true,
                      responseMessage:
                        "Amount: " +
                        ammount +
                        " sent from: " +
                        fromAccount +
                        " to: " +
                        toAccount +
                        " Since transaction hash is : " +
                        txtHash,
                      responseCode: 807,
                    });
                  })
                  .catch((error) => {
                    console.log(error.message);
                    console.log("Error in sending signed transactions..!");
                    console.log({
                      responsePayload: error.message,
                      responseMessage:
                        "Please provide enough gas ammount to process transaction",
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

  return (
    <div>
      <Button
        onClick={getBlaance}
        style={{ marginTop: "0" }}
        variant="outlined"
        color="primary"
      >
        {`Balance : (${balance})`}
      </Button>
      <Button
        onClick={handleOpen}
        style={{ marginTop: "0" }}
        variant="contained"
        color="primary"
      >
        Get Balance
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <InputLabel
              style={{ marginTop: "0", marginBottom: 10, fontSize: 20 }}
            >
              Get balance
            </InputLabel>

            <Grid container>
              <Grid item xs={3}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 150, marginTop: "5%" }}
                  label="From"
                  variant="outlined"
                  onChange={(e) => {
                    setFromAccount(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 150, marginTop: "5%" }}
                  label="To"
                  variant="outlined"
                  value={toAccount}
                  onChange={(e) => {
                    setToAccount(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 150, marginTop: "5%" }}
                  label="Ammount"
                  variant="outlined"
                  onChange={(e) => {
                    setAmmount(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 150, marginTop: "5%" }}
                  label="Account Pin"
                  variant="outlined"
                  onChange={(e) => {
                    setAccountPin(e.target.value);
                  }}
                />
              </Grid>
              {/* <Grid item xs={3}>
                
              </Grid> */}

              <Grid
                item
                xs={12}
                style={{
                  textAlign: "center",
                  marginTop: "5%",
                  marginRight: "7%",
                }}
              >
                <Button
                  onClick={handleTransfer}
                  style={{ marginTop: "7%" }}
                  variant="contained"
                  color="primary"
                >
                  Transfer
                </Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
