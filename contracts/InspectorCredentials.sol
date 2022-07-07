// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.21 <0.7.0;

contract InspectorCredentials {
   string userName="safdar";    
   string password="1234";
   function login(string memory uName,string memory pass) public view returns (bool response){
       if(keccak256(bytes(userName)) == keccak256(bytes(uName)) && keccak256(bytes(password)) == keccak256(bytes(pass)) ) 
       {
       response=true;
       }
       else response=false;
    }

}
