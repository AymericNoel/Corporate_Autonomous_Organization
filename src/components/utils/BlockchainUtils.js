import Web3 from "web3";

import RewardContract from "../../contracts/RewardNFT.json";
import CaoContract from "../../contracts/Cao.json";
import TeamContract from "../../contracts/TeamNFT.json";
import CaoToken from "../../contracts/CaoToken.json";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        // Modern dapp browsers...
        const web3 = new Web3(window.ethereum);
        try {
          window.ethereum.on("chainChanged", () => window.location.reload());
          window.ethereum.on("accountsChanged", () => window.location.reload());
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const { web3 } = window;
        console.log("Injected web3 detected.");
        resolve(web3);
      } else {
        // Fallback to localhost; use dev console port by default...
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

const getAccounts = (_web3) => _web3.eth.getAccounts();

const getContracts = async (_web3) => {
  const networkId = await _web3.eth.net.getId();

  const deployedNetworkReward = RewardContract.networks[networkId];
  const deployedNetworkCao = CaoContract.networks[networkId];
  const deployedNetworkTeam = TeamContract.networks[networkId];
  const deployedNetworkToken = CaoToken.networks[networkId];

  const rewardInstance = new _web3.eth.Contract(
    RewardContract.abi,
    deployedNetworkReward && deployedNetworkReward.address
  );
  const caoInstance = new _web3.eth.Contract(
    CaoContract.abi,
    deployedNetworkCao && deployedNetworkCao.address
  );
  const teamInstance = new _web3.eth.Contract(
    TeamContract.abi,
    deployedNetworkTeam && deployedNetworkTeam.address
  );
  const tokenInstance = new _web3.eth.Contract(
    CaoToken.abi,
    deployedNetworkToken && deployedNetworkToken.address
  );

  return {
    RewardContract: rewardInstance,
    CaoContract: caoInstance,
    TeamContract: teamInstance,
    CaoToken: tokenInstance,
  };
};

const BlockchainUtils = {
  getAccounts,
  getContracts,
  getWeb3,
};

export default BlockchainUtils;
