// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.21 <0.7.0;

contract LandRecords{
    struct LandInfo{
        string sellerName;
        string sellerAccountAddress;
        string sellingPrice;
        string landDetails;
        bool isApproved;
        string buyerName;
        string buyerAccountAddress;
        // string purchaseTimeAndDate;
    }

    uint counter=0;
    mapping(string => LandInfo) private listOfLandRecords;

    function registerForSelling(string memory id,string memory sellerName,string memory sellerAccountAddress,
    string memory sellingPrice,string memory landDetails
    ) public {
      listOfLandRecords[id].sellerName=sellerName;
      listOfLandRecords[id].sellerAccountAddress=sellerAccountAddress;
      listOfLandRecords[id].sellingPrice=sellingPrice;
      listOfLandRecords[id].landDetails=landDetails;
      listOfLandRecords[id].isApproved=false;
      counter++;
    }

    function getAllLandRecordsCount() public view returns (uint){
       return counter;
    }

    function updateAprrovalStatus(string memory id) public {
        listOfLandRecords[id].isApproved=true;
    }

    function updatePurchaseDetails(string memory id,string memory buyerName,string memory buyerAccountAddress) public {
          listOfLandRecords[id].buyerAccountAddress=buyerAccountAddress;
          listOfLandRecords[id].buyerName=buyerName;
    }

    function getLandDetails(string memory id) public view returns(
        string memory sellerName,string memory sellerAccountAddress,
        string memory sellingPrice,string memory landDetails,bool  isApproved,string memory buyerName,
        string memory buyerAccountAddress
    ){
      sellerName = listOfLandRecords[id].sellerName;
      sellerAccountAddress=  listOfLandRecords[id].sellerAccountAddress;
      sellingPrice = listOfLandRecords[id].sellingPrice;
      landDetails = listOfLandRecords[id].landDetails;
      isApproved = listOfLandRecords[id].isApproved;
      buyerName=listOfLandRecords[id].buyerName;
      buyerAccountAddress=listOfLandRecords[id].buyerAccountAddress;

    }
}
