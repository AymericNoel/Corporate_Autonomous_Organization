import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Modal,
  Grid,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect, useContext } from "react";
import MintForm from "../utils/MintForm";
import TeamCreationForm from "../utils/TeamCreationForm";
import SendTokenForm from "../utils/SendTokenForm";
import BlockchainContext from "../../context";

function Admin() {
  const { accounts, contracts, web3 } = useContext(BlockchainContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mintTeamOpen, setMintTeamOpen] = useState(false);
  const [mintRewardOpen, setMintRewardOpen] = useState(false);
  const [teamCreationOpen, setTeamCreationOpen] = useState(false);
  const [sendTokenOpen, setSendTokenOpen] = useState(false);

  const MintTeamMemberModalOpen = () => setMintTeamOpen(true);
  const MintTeamMemberModalClose = () => setMintTeamOpen(false);

  const MintRewardModalOpen = () => setMintRewardOpen(true);
  const MintRewardModalClose = () => setMintRewardOpen(false);

  const TeamCreationModalOpen = () => setTeamCreationOpen(true);
  const TeamCreationModalClose = () => setTeamCreationOpen(false);

  const SendTokenModalOpen = () => setSendTokenOpen(true);
  const SendTokenModalClose = () => setSendTokenOpen(false);

  const [nativeBalance, setNativeBalance] = useState(0);
  const [requiredBalance, setRequiredBalance] = useState(0);

  useEffect(async () => {
    var sw = JSON.parse(sessionStorage.getItem("skillWallet"));
    if (sw && sw.isCoreTeamMember) {
      try {
        var balance = await contracts.RewardContract.methods
          .getEtherBalance()
          .call();
        var requiredBalance = await contracts.RewardContract.methods
          .requiredEthers()
          .call();
        setNativeBalance(web3.utils.fromWei(balance));
        setRequiredBalance(web3.utils.fromWei(requiredBalance));
      } catch (error) {
        console.log(error);
      }
      setIsAdmin(true);
    }
  }, [contracts]);

  const giveEtherAway = async () => {
    try {
      await contracts.RewardContract.methods
        .giveAwayRaise()
        .send({ from: accounts[0] });
    } catch (error) {
      alert("Transaction failed");
      console.log(error);
    }
  };

  const addEtherToContract = async () => {
    try {
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: contracts.RewardContract._address,
        value: web3.utils.toWei("0.5"),
      });
    } catch (error) {
      alert("Transaction failed");
      console.log(error);
    }
  };

  const toDisplay = () => {
    if (isAdmin) {
      return (
        <div>
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Box>
              <Button
                variant="contained"
                size="medium"
                sx={{ m: 1 }}
                onClick={MintTeamMemberModalOpen}
              >
                Mint team member
              </Button>
              <Modal open={mintTeamOpen} onClose={MintTeamMemberModalClose}>
                <div>
                  <MintForm team />
                </div>
              </Modal>
              <Button
                variant="contained"
                size="medium"
                sx={{ m: 1 }}
                onClick={MintRewardModalOpen}
              >
                Mint reward
              </Button>
              <Modal open={mintRewardOpen} onClose={MintRewardModalClose}>
                <div>
                  <MintForm reward />
                </div>
              </Modal>
            </Box>
            <Box>
              <Button
                variant="contained"
                size="medium"
                sx={{ m: 1 }}
                onClick={SendTokenModalOpen}
              >
                Start tokens flow / Send Tokens
              </Button>
              <Modal open={sendTokenOpen} onClose={SendTokenModalClose}>
                <div>
                  <SendTokenForm />
                </div>
              </Modal>
              <Button
                variant="contained"
                size="medium"
                sx={{ m: 1 }}
                onClick={TeamCreationModalOpen}
              >
                Add a new team
              </Button>
              <Modal open={teamCreationOpen} onClose={TeamCreationModalClose}>
                <div>
                  <TeamCreationForm />
                </div>
              </Modal>
            </Box>
            <Box>
              <Button
                variant="contained"
                size="medium"
                sx={{ m: 1 }}
                onClick={giveEtherAway}
              >
                Give Ether away
              </Button>
              <Button
                variant="contained"
                size="medium"
                sx={{ m: 1 }}
                onClick={addEtherToContract}
              >
                Add ethers to reward contract
              </Button>
            </Box>
          </Box>
          <Box sx={{ width: "20%", ml: 3, mt: 8 }}>
            <Card sx={{ boxShadow: 6, textAlign: "center" }}>
              <CardHeader title="Current Contract Ether balance:" />
              <CardContent>
                <Typography variant="h6">{nativeBalance} ethers</Typography>
              </CardContent>
            </Card>
            <Card sx={{ boxShadow: 6, textAlign: "center" , mt:4}}>
              <CardHeader title="Required Contract Ether balance:" />
              <CardContent>
                <Typography variant="h6">{requiredBalance} ethers</Typography>
              </CardContent>
            </Card>
          </Box>
        </div>
      );
    }
    return <p>You're not part of core members...</p>;
  };

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        component="div"
        sx={{ mx: 4, my: 4 }}
      >
        Admin
      </Typography>
      {toDisplay()}
    </div>
  );
}

export default Admin;
