import React, { useEffect, useState } from "react";
import {  Box, Button, InputLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Headings } from '../Support/Headings/Headings';
import { SimpleTextField } from '../Support/TextFields/TextFields';
import {lightBorder} from '../Theme/borders'
import {SimpleButton} from '../Support/Buttons/Buttons'
import { SimpleLinks } from '../Support/Link/Links';
import SellerAccountContract from "../contracts/SellerAccounts.json";
import { useNavigate } from 'react-router-dom'
import SinInForm from './SinInForm';
import SinUpForm from './SinUpForm';
import { Card, CardContent, Divider, Grid } from '@material-ui/core';
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

export default function SellerHomeScreen({ web3 }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleLoginOpen = () => {
    setOpen(true);
  };

  const handleCreateOpen = () => {
    setOpen(true);
  };

  const handleLoginClose = () => {
    setOpen(false);
  };

  const handleCreateClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [accountPin, setAccountPin] = useState("");
  const [sellerAccountsContract, setSellerAccountContract] = useState(null);

  useEffect(() => {
    if (web3) {
      const getContractInstance = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SellerAccountContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SellerAccountContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setSellerAccountContract(instance);
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
          const response = await sellerAccountsContract.methods
            .createSellerAccount(userName, name, accountAddress)
            .send({ from: accounts[0] })
            .catch((error) => {
              alert(error.message);
            });
          if (response) {
            console.log(response);
            alert(response.transactionHash);
            localStorage.setItem('name',name);
            localStorage.setItem('accountAddress',accountAddress);

            navigate("/seller")
          }
        };
        storeRecordOnBlockchain();
      });
  };
  const handelLoginAccount = () => {
    const getAcconutDetails = async () => {
      const response = await sellerAccountsContract.methods
        .getSellerAccountAddress(userName)
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
            localStorage.setItem('name',response.name);
            localStorage.setItem('accountAddress',response.accountAddress);

            navigate("/seller")
        }).catch((error)=>{
            alert(error.message)
        });
    };
    getAcconutDetails();
  };

  const [doHaveAccount,setDoHaveAccount]=useState(false);
  

  return (
    <div>
    <div>
            <Grid container>
                <Grid item lg={1} md={1} sm={0}></Grid> 
                <Grid item lg={10} md={10} sm={12} >
                    <Card
                        elevation={0}
                        style={{border:lightBorder,marginLeft:'auto',marginRight:'auto',marginTop:'2rem',width:'30rem',height:'35rem'}}
                    >

                        <CardContent>
                            
                            {
                                (!doHaveAccount) && <div>
                                    <SinUpForm web3={web3} doHaveAccount={doHaveAccount} setDoHaveAccount={setDoHaveAccount}/>
                                </div>
                            }
                            {
                                (doHaveAccount) && <div>
                                    <SinInForm  web3={web3}  doHaveAccount={doHaveAccount} setDoHaveAccount={setDoHaveAccount}/>
                                </div>
                            }
                        </CardContent>
                    </Card>
                </Grid> 
                <Grid item lg={1} md={1} sm={0}></Grid> 
            </Grid>
        </div>
      {/* <InputLabel style={{ marginTop: "5%", fontSize: 50 }}>Seller</InputLabel> */}
      {/* <div>
      <Button
        onClick={handleLoginOpen}
        style={{ marginTop: "5%" }}
        variant="contained"
        color="primary"
      >Login Account
      </Button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleLoginClose}
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
              Login to the seller acconunt
            </InputLabel>

            <Grid container>
              <Grid item xs={4}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 150, marginTop: "5%" }}
                  label="User name"
                  variant="outlined"
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                /><br/>
              </Grid>
              <Grid item sm={4}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 150, marginTop: "5%" }}
                  label="Name"
                  variant="outlined"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Grid><br/>
              <Grid item sm={4}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 150, marginTop: "5%" }}
                  label="Account Pin"
                  variant="outlined"
                  onChange={(e) => {
                    setAccountPin(e.target.value);
                  }}
                />
              </Grid><br/>
              <Grid item sm={4}>
                <Button
                  onClick={handelCreateAccount}
                  style={{ marginTop: "7%" }}
                  variant="contained"
                  color="primary"
                >
                  Create
                </Button>
              </Grid>
              </Grid>
            </div>
          </Fade>
        </Modal>
      
      </div>*/}
        {/* <Button 
        onClick={handleCreateOpen}
        style={{ marginTop: "5%", marginLeft:"10px" }}
        variant="contained"
        color="primary"
      >Create Account
      </Button> */}
            {/* <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleCreateClose}
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
      </Modal> */}
    
    </div>
  );
}
