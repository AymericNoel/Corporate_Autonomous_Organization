const CaoToken = artifacts.require("CaoToken");
const RewardNFT = artifacts.require("RewardNFT");
const TeamNFT = artifacts.require("TeamNFT");
const AvatarNFT = artifacts.require("AvatarNFT");
const Cao = artifacts.require("Cao");

module.exports = function (deployer){  
  deployer.deploy(CaoToken, "CaoToken", "CAO", [])
  .then(() => deployer.deploy(Cao, CaoToken.address))
  // .then(()=> deployer.deploy(AvatarNFT, "https://monLienNFT/", "avatar","AVA", CaoToken.address))
  .then(()=> deployer.deploy(RewardNFT, "reward NFT","GIFT", CaoToken.address))
  .then(()=>deployer.deploy(TeamNFT, "team NFT","TEAM"));
};
