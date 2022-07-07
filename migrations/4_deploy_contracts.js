var SellerAccounts = artifacts.require("./SellerAccounts.sol");

module.exports = function(deployer) {
  deployer.deploy(SellerAccounts);
};
