// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.21 <0.7.0;

contract BuyerAccounts{
    struct BuyerInfo{
        string name;
        string accountAddress;
    }
    mapping(string => BuyerInfo) private listOfBuyers;

    function createBuyerAccount(string memory uName,string memory name,string memory accountAddress) public  returns (string memory response){
      listOfBuyers[uName].name=name;
      listOfBuyers[uName].accountAddress=accountAddress;

      response="Account created";
    }
    function getBuyerAccountAddress(string memory uName) public view returns (string memory name,string memory accountAddress){
        name=listOfBuyers[uName].name;
        accountAddress=listOfBuyers[uName].accountAddress;
    }

}
