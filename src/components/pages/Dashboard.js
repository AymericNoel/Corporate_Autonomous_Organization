import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardHeader } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import BlockchainContext from "../../context";
import VisualizeNft from "../utils/ViewNftIPFS";

function Dashboard() {
  const { accounts, contracts, web3 } = useContext(BlockchainContext);
  const [userData, setUserData] = useState({});
  const [connected, setConnected] = useState(false);
  const [streamBalance, setStreamBalance] = useState(0);
  const [fluxId, setFluxId]=useState(0)


  useEffect(async () => {
    var sw = JSON.parse(sessionStorage.getItem("skillWallet"));
    var nftUri = "";
    var teamInformations = {};
    var nativeBalance=0;
    if (sw) {
      const id = setInterval(() => setStreamBalance((oldCount) => oldCount + 0.003), 1500);
      setFluxId(id)
      try {
        var nativeBalance = await contracts.CaoToken.methods
          .balanceOf(accounts[0])
          .call();

        nativeBalance = web3.utils.fromWei(nativeBalance);
        var teamNftId = await contracts.TeamContract.methods
          .tokenOfOwnerByIndex(accounts[0], 0)
          .call();
        if (teamNftId != "") {
          nftUri = await contracts.TeamContract.methods
            .tokenURI(teamNftId)
            .call();            
          nftUri = await VisualizeNft(nftUri);
          console.log(nftUri)
          var teamId = await contracts.TeamContract.methods
            .teamByTokenId(teamNftId)
            .call();
          teamId += 1;
          teamInformations = await contracts.TeamContract.methods
            .teamById(teamId)
            .call();
        }
      } catch (error) {
        console.log(error);
      }

      setUserData({
        username: sw.nickname,
        profileImageUrl: sw.imageUrl,
        isLoggedIn: true,
        coreTeam: sw.isCoreTeamMember,
        nativeBalance: nativeBalance,
        nftUri,
        teamInformations,
      });
      setConnected(true);
      return () => {
        clearInterval(id);
      };
    } else {
      setConnected(false);
    }
  }, [contracts]);

  const stopTimer=()=>{
    clearInterval(fluxId);    
  }

  const toDisplay = () => {
    if (connected) {
      return (
        <div>
          <Box sx={{ mx: 3 }}>
            <Grid container spacing={5}>
              <Grid item xs>
                <Card sx={{ boxShadow: 5 }}>
                  <CardHeader title="MY AVATAR" sx={{ textAlign: "center" }} />
                  <CardMedia
                    component="img"
                    sx={{ width: "50%", mx: "auto" }}
                    image={userData.profileImageUrl}
                    alt="avatar"
                  />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      My rank : {userData.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Core team member : {userData.coreTeam.toString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs>
                <Card sx={{ boxShadow: 5 }}>
                  <CardHeader title="TEAM" sx={{ textAlign: "center" }} />
                  {userData.nftUri != "" && (
                    <div>
                      <CardMedia
                        component="img"
                        sx={{ width: "50%", mx: "auto" }}
                        image={"https://nftstorage.link/ipfs/bafybeia5s7c3btftjvu7t35l73nithmnedukvtchpnkeupa2v2v6ckwbfi/trophy.png"}
                        alt="team nft"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          My team is : {userData.teamInformations[1]}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          We are : {Number(userData.teamInformations[3]) + 1}
                        </Typography>
                      </CardContent>
                    </div>
                  )}
                </Card>
              </Grid>
              <Grid item xs>
                <Card sx={{ boxShadow: 5 }}>
                  <CardHeader title="BALANCE" sx={{ textAlign: "center" }} />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Cao governance balance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userData.nativeBalance} CAO
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      marginTop={2}
                    >
                      Cao flux balance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {streamBalance} CAO
                    </Typography>
                    <Box sx={{ my: 5, textAlign: "center" }}>
                      <Button variant="contained" color="info" sx={{ m: 2 }} onClick={stopTimer}>
                        Stop flux
                      </Button>
                      <Button variant="contained" color="info">
                        Convert flux tokens to Cao for governance
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </div>
      );
    }
    return <p>You're not connected with skillWallet...</p>;
  };

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        component="div"
        sx={{ mx: 4, my: 4 }}
      >
        Dashboard
      </Typography>
      {toDisplay()}
    </div>
  );
}

export default Dashboard;
