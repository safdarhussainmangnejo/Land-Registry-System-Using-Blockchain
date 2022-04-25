// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.21 <0.7.0;

contract SellerAccounts{
    struct SellerInfo{
        string name;
        string accountAddress;
    }
    mapping(string => SellerInfo) private listOfSellers;

    function createSellerAccount(string memory uName,string memory name,string memory accountAddress) public  returns (string memory response){
      listOfSellers[uName].name=name;
      listOfSellers[uName].accountAddress=accountAddress;

      response="Account created";
    }
    function getSellerAccountAddress(string memory uName) public view returns (string memory name,string memory accountAddress){
        name=listOfSellers[uName].name;
        accountAddress=listOfSellers[uName].accountAddress;
    }

}
