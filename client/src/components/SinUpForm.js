import { Card, CardContent, colors, Divider, Grid } from '@material-ui/core';
import React,{useEffect, useState} from 'react';
import { Headings } from '../Support/Headings/Headings';
import { lightBorder } from '../Theme/borders';
import { SimpleTextField } from '../Support/TextFields/TextFields';
import { SimpleLinks } from '../Support/Link/Links';
import { SimpleButton } from '../Support/Buttons/Buttons';
import { useNavigate } from 'react-router-dom';
import SellerAccountContract from "../contracts/SellerAccounts.json";
function SinUpForm({web3,...props}) {
    // const [userName,setuserName]=useState();
    // const [lastName,setLastName]=useState();
    // const [name,setname]=useState();
    // const [accountPin,setaccountPin]=useState();
    // const [password,setpassword]=useState();

    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [accountPin, setAccountPin] = useState("");
    const navigate = useNavigate();

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
    
      const handelCreaAccount = (e) => {
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
    
                navigate("/sellerdashboard")
              }
            };
            storeRecordOnBlockchain();
          });
      };
      
    return (
        <div>
            {/* Title */}
            <div style={{padding:'1rem'}}>
                                <Headings text={"Sin up"} fontSize={30} fontWeight={'bold'}/>
                            </div>
                            <Divider/>
                                    <Grid container style={{padding:'1rem'}}>
                                    <Grid item xs={12} style={{padding:'1rem',backgroundColor:''}}>
                                               <SimpleTextField 
                                                value={userName}
                                                setValue={setUserName}
                                                label="USer Name"
                                                fullWidth
                                            />
                                        </Grid>
                                        {/* <Grid item xs={6} style={{padding:'1rem'}}>
                                            <SimpleTextField 
                                                value={lastName}
                                                setValue={setLastName}
                                                label="Last Name"
                                            />
                                        </Grid> */}
                                        <Grid item xs={12} style={{padding:'1rem',backgroundColor:''}}>
                                            <SimpleTextField 
                                                value={name}
                                                setValue={setName}
                                                label="name"
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
                                        {/* <Grid item xs={12} style={{padding:'1rem',backgroundColor:''}}>
                                            <SimpleTextField 
                                                value={password}
                                                setValue={setpassword}
                                                label="Password"
                                                fullWidth
                                                
                                            />
                                        </Grid> */}
                                        <Grid item xs={12} style={{textAlign:'center'}}>
                                           <SimpleButton
                                                name="Creat Account"
                                                handelClick={(e)=>{
                                                    handelCreaAccount(e);
                                                }}
                                           />
                                        </Grid>
                                        <Grid item xs={12} style={{textAlign:'center'}}>
                                          <SimpleLinks
                                            name={"Have account.. Login"}
                                            handelClick={()=>{
                                                props.setDoHaveAccount(!props.doHaveAccount)
                                            }}
                                          />
                                        </Grid>
                                        
                                    </Grid>
                            
        </div>
    );
}

export default SinUpForm;