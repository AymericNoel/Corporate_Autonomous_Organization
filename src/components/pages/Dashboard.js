import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardHeader } from "@mui/material";
import { useState, useEffect } from "react";

function Dashboard() {
  const [userData, setUserData] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    var sw = JSON.parse(sessionStorage.getItem("skillWallet"));
    if (sw) {
      setUserData({
        username: sw.nickname,
        profileImageUrl: sw.imageUrl,
        isLoggedIn: true,
        coreTeam: sw.isCoreTeamMember
      });
      setConnected(true)
    }else{
      setConnected(false)
    }
  }, [connected]);

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
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      My rank : {userData.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Core team member : {userData.coreTeam.toString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs>
                <Card sx={{ boxShadow: 5 }}>
                  <CardHeader title="TEAM" sx={{ textAlign: "center" }} />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      NFT team :
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      My team is
                    </Typography>
                  </CardContent>
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
                      0.005 CAO
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" marginTop={2}>
                      Cao flux balance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      5 CAO
                    </Typography>
                    <Box sx={{my: 5, textAlign:"center"}}>
                      <Button variant="contained" color="info" sx={{m: 2}}>
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
