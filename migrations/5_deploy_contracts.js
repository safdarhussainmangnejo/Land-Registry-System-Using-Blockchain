var BuyerAccounts = artifacts.require("./BuyerAccounts.sol");

module.exports = function(deployer) {
  deployer.deploy(BuyerAccounts);
};
