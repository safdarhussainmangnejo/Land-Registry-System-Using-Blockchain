import { Card, CardContent, Divider, Grid } from '@material-ui/core';
import React,{useState} from 'react';
import { Headings } from '../Support/Headings/Headings';
import {lightBorder} from '../Theme/borders'
import { SimpleTextField } from '../Support/TextFields/TextFields';
import { SimpleLinks } from '../Support/Link/Links';
import { SimpleButton } from '../Support/Buttons/Buttons';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SellerAccountContract from "../contracts/SellerAccounts.json";
function SinInForm({web3, ...props}) {

    const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  
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

      const handelSinInEvent = (e) => {
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
    
                navigate("/sellerdashboard")
            }).catch((error)=>{
                alert(error.message)
            });
        };
        getAcconutDetails();
      };
    return (
        <div>
                     {/* Title */}
                     <div style={{padding:'1rem'}}>
                                <Headings text={"Sin in"} fontSize={30} fontWeight={'bold'}/>
                            </div>
                            <Divider/>
                            <Grid container>
                                <Grid item xs={12} style={{padding:'1rem',backgroundColor:''}}>
                                            <SimpleTextField 
                                                value={userName}
                                                setValue={setUserName}
                                                label="userName"
                                                fullWidth
                                            />
                                </Grid>
                                <Grid item xs={12} style={{padding:'1rem',backgroundColor:''}}>
                                            <SimpleTextField 
                                                value={accountPin}
                                                setValue={setAccountPin}
                                                label="accountPin"
                                                fullWidth
                                                
                                            />
                                </Grid>
                                <Grid item xs={12} style={{textAlign:'center'}}>
                                           <SimpleButton
                                                name="Sin in"
                                                handelClick={(e)=>{
                                                    // setDoHaveAccount(!doHaveAccount)
                                                    handelSinInEvent(e);
                                                }}
                                           />
                                </Grid>
                                <Grid item xs={12} style={{textAlign:'center'}}>
                                          <SimpleLinks
                                            name={"Don't have account ?"}
                                            handelClick={()=>{
                                                props.setDoHaveAccount(!props.doHaveAccount)
                                            }}
                                          />
                                </Grid>
                            </Grid>
                           
        </div>
    );
}

export default SinInForm;