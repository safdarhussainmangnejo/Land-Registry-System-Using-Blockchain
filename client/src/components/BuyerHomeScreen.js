import React, { useEffect, useState } from "react";
import { Grid, Box, Button, InputLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BuyerAccountsContract from'../contracts/BuyerAccounts.json'
import { useNavigate } from "react-router-dom";

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

export default function BuyerHomeScreen({ web3 }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [accountPin, setAccountPin] = useState("");
  const [buyerAccountsContract, setBuyerAccountsContract] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (web3) {
      const getContractInstance = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = BuyerAccountsContract.networks[networkId];
        const instance = new web3.eth.Contract(
          BuyerAccountsContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setBuyerAccountsContract(instance);
      };

      getContractInstance();
    }
  }, [web3]);

  const handelCreateAccount = () => {
    web3.eth.personal
      .newAccount(accountPin)
      .then()
      .then((accountAddress) => {
        console.log(accountAddress);
        const storeRecordOnBlockchain = async () => {
          const accounts = await web3.eth.getAccounts();
          const response = await buyerAccountsContract.methods
            .createBuyerAccount(userName, name, accountAddress)
            .send({ from: accounts[0] })
            .catch((error) => {
              alert(error.message);
            });
          if (response) {
            console.log(response);

            localStorage.setItem("name",name);
            localStorage.setItem("accountAddress",accountAddress);
            navigate("/buyer")
            alert(response.transactionHash);
          }
        };
        storeRecordOnBlockchain();
      });
  };

  const handelLoginAccount = () => {
    const getAcconutDetails = async () => {
      const response = await buyerAccountsContract.methods
        .getBuyerAccountAddress(userName)
        .call();

      web3.eth.personal
        .unlockAccount(
          response.accountAddress,
          accountPin,
          600
        )
        .then((resp)=>{
            console.log(resp)
            alert("Account Unlcoked")
            localStorage.setItem("name",name);
            localStorage.setItem("accountAddress",response.accountAddress);
            navigate("/buyer")
        }).catch((error)=>{
            alert(error.message)
        });
    };
    getAcconutDetails();
  };

  return (
    <div>
      <InputLabel style={{ marginTop: "20%", fontSize: 50 }}>Buyer</InputLabel>

      <Button
        onClick={handleOpen}
        style={{ marginTop: "50%" }}
        variant="contained"
        color="primary"
      >
        Login/Create Account
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
              Login/Create the inspector acconunt
            </InputLabel>

            <Grid container>
              <Grid item xs={3}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 150, marginTop: "5%" }}
                  label="User name"
                  variant="outlined"
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 150, marginTop: "5%" }}
                  label="Name"
                  variant="outlined"
                  onChange={(e) => {
                    setName(e.target.value);
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
              <Grid item xs={3}>
                <Button
                  onClick={handelCreateAccount}
                  style={{ marginTop: "7%" }}
                  variant="contained"
                  color="primary"
                >
                  Create
                </Button>
              </Grid>

              {/* <Grid
                item
                xs={12}
                style={{
                  textAlign: "center",
                  marginTop: "5%",
                  marginRight: "7%",
                }}
              >

              </Grid> */}
              <Grid item xs={3}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 150, marginTop: "5%" }}
                  label="User Name"
                  variant="outlined"
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={3}></Grid>
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
              <Grid item xs={3}>
                <Button
                  onClick={handelLoginAccount}
                  style={{ marginTop: "7%" }}
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
