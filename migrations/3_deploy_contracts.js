var InspectorCredentials = artifacts.require("./InspectorCredentials.sol");

module.exports = function(deployer) {
  deployer.deploy(InspectorCredentials);
};
