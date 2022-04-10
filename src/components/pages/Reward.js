import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardHeader, ImageList,ImageListItem } from "@mui/material";
import BlockchainContext from "../../context";
import { useState, useEffect, useContext } from "react";
import VisualizeNft from "../utils/ViewNftIPFS";

function Reward() {
  const { accounts, contracts, web3 } = useContext(BlockchainContext);
  const [rewardsUri, setRewardsUri] = useState([]);

  useEffect(async () => {
    var nftsUri = [];
    try {
      var numberOfRewards = await contracts.RewardContract.methods
        .currentNftByOwner(accounts[0])
        .call();
      for (let i = 0; i < Number(numberOfRewards); i++) {
        var nftId = await contracts.RewardContract.methods
          .tokenOfOwnerByIndex(accounts[0], i)
          .call();
        var nftUri = await contracts.RewardContract.methods
          .tokenURI(nftId)
          .call();

        nftUri = await VisualizeNft(nftUri);
        console.log(nftUri);
        nftsUri.push(nftUri);
      }
      setRewardsUri(nftsUri);
    } catch (error) {
      setRewardsUri([]);
      console.log(error);
    }
  }, [contracts]);

  const toDisplay = () => {
    if (rewardsUri.length > 0) {
      return (
        <div>
          {
            <ImageList sx={{ width: 800, height: 800 }} cols={3} rowHeight={164}>
              {rewardsUri.map((uri, index) => (
                <ImageListItem key={index}>
                  <Typography textAlign={"center"} variant="subtitle1">Reward n°{index+1}</Typography>
                  <img
                    src={uri}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          }
        </div>
      );
    } else {
      return <p>No rewards here yet ...!</p>;
    }
  };

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        component="div"
        sx={{ mx: 4, my: 4 }}
      >
        Rewards
      </Typography>
      <Box sx={{ mx: 3 }}>
        {toDisplay()        }
      </Box>
    </div>
  );
}

export default Reward;
