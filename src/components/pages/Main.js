import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import BlockchainContext from "../../context";

function Main() {
  const { accounts } = useContext(BlockchainContext);
  const [address, setAddress]= useState("undefined address");

  useEffect(() => {
    const load = async () => {
      const address = accounts[0];
      setAddress(address)
    };

    if (typeof accounts !== "undefined") {
      load();
    }
  }, [accounts]);
  return (
    <div>
      <Typography align="center" variant="h3">
        Corporate Autonomous Organization
      </Typography>
      <Box sx={{ m: 5 }}>description de l'appli ici</Box>
      <p>{address}</p>
    </div>
  );
}

export default Main;
