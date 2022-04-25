import React, { Component, useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import Home from "./components/Home";
import { Route,Routes } from "react-router-dom";
import SellerHomeScreen from "./components/SellerHomeScreen";
import InspectorDashboard from "./components/InspectorDashboard";
import BuyerDashBoard from "./components/BuyerDashBoard";
import Navbar from "./components/Navbar";
import Aboutus from "./components/Aboutus";
import SellerDashboard from "./components/SellerDashboard";
function App() {
  const [web3,setweb3]=useState();
  const initWeb3= async()=>{
   const web3Instance =  await getWeb3();

   setweb3(web3Instance)
  }

  useEffect(()=>{
    initWeb3()
  },[])
  return <>
  <Navbar/>
    <Routes>
      <Route path="/" element={<Home web3={web3}/>}/>
      <Route path="/Home" element={<Home web3={web3}/>}/>
      <Route path="/About" element={<Aboutus/>}/>
      <Route path="/Inspecter" element={<InspectorDashboard web3={web3}/>}/>
      <Route path="/seller" element={<SellerHomeScreen web3={web3}></SellerHomeScreen>} />
      <Route path="/sellerdashboard" element={<SellerDashboard web3={web3}></SellerDashboard>} />
      
      
      <Route path="/buyer" element={<BuyerDashBoard web3={web3}></BuyerDashBoard>} />

    </Routes>


  </>
}

export default App;
