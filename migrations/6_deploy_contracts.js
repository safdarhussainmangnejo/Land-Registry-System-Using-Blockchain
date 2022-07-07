var LandRecords = artifacts.require("./LandRecords.sol");

module.exports = function(deployer) {
  deployer.deploy(LandRecords);
};
