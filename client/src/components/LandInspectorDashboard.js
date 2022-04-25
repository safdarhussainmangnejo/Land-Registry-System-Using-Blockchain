import React, { useEffect, useState } from "react";
import { Grid, Box, Button, InputLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import InspectCredentialsContract from "../contracts/InspectorCredentials.json";
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

export const LandInspectorDashboard = ({ web3 }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Accounts list
  const [listOfAccounts, setListOfAccounts] = useState();
  const [inspectorCredentials, setInspectorCredentials] = useState(null);
  const [userName,setUserName]=useState("");
  const [password,setPassword]=useState("");

  useEffect(() => {
    // web3.eth.getAccounts(console.log);
    if (web3) {
      web3.eth.getAccounts().then((data) => {
        setListOfAccounts(data);
      });

      const getContractInstance = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = InspectCredentialsContract.networks[networkId];
        const instance = new web3.eth.Contract(
          InspectCredentialsContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setInspectorCredentials(instance);
      };

      getContractInstance();
    }
  }, [web3]);

  
  const navigate = useNavigate();
  function handelLogin() {
    if (inspectorCredentials) {
      const loginTheAccount = async () => {
        const response = await inspectorCredentials.methods
          .login(userName,password)
          .call();
        console.log(response)  
        if(response){
          alert("Login Sucessfull")
          navigate("/Inspecter")
        }
        else{
          alert("Incorect credentials")
        }
      };
      loginTheAccount();
    }
  }

  return (
    <div>
      <InputLabel style={{ marginTop: "20%", fontSize: 50 }}>
        Inspector dashboard
      </InputLabel>

      <Button
        onClick={handleOpen}
        style={{ marginTop: "50%" }}
        variant="contained"
        color="primary"
      >
        Open dashboard
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
              Login to inspector acconunt
            </InputLabel>

            <Grid container>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 250, marginTop: "5%" }}
                  label="User name"
                  variant="outlined"
                  onChange={(e)=>{
                    setUserName(e.target.value)
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="outlined-basic"
                  style={{ width: 250, marginTop: "5%" }}
                  label="Password "
                  variant="outlined"
                  onChange={(e)=>{
                    setPassword(e.target.value)
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  textAlign: "right",
                  marginTop: "5%",
                  marginRight: "7%",
                }}
              >
                <Button
                  onClick={handelLogin}
                  style={{ marginLeft: "2%" }}
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
};
