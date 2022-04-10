import { TextField, Button, Box } from "@mui/material";
import { NFTStorage } from "nft.storage";
import { useState, useContext } from "react";
import BlockchainContext from "../../context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

function TeamCreationForm() {
  const { accounts, contracts } = useContext(BlockchainContext);
  const [values, setValues] = useState({
    creation_date: "",
    eth_addr: "",
    inputFile: null,
    nameFile: "Upload NFT Image Team Leader (png)",
    team_name: "",
  });

  const handleChangeForm = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const onClickBtn = async () => {
    try {
      const metadata = await storeNFT(values.inputFile, values.nameFile);
      console.log(metadata);
      await contracts.TeamContract.methods
        .createTeam(
          new Date(values.creation_date).getTime(),
          values.eth_addr,
          values.team_name,
          metadata.url
        )
        .send({ from: accounts[0] });
    } catch (error) {
      alert("error during Tx");
      console.log(error);
    }
  };

  const storeNFT = async (fileContent, fileName) => {
    const nftstorage = new NFTStorage({
      token: process.env.REACT_APP_NFT_STORAGE_TOKEN,
    });

    const description = "NFT for team member in CAO";
    const name = fileName;
    return nftstorage.store({
      image: fileContent,
      name,
      description,
    });
  };

  const inputFileHandler = (event) => {
    try {
      const nameFile = event.target.files[0].name;
      const file = event.target.files[0];
      setValues({ ...values, inputFile: file, nameFile });
    } catch (error) {
      setValues({ ...values, nameFile: "null" });
    }
  };

  return (
    <Box sx={style}>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 2, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        values={values}
        handleChangeForm={handleChangeForm}
      >
        <TextField
          id="team_name"
          label="Team Name"
          variant="standard"
          name="team_name"
          onChange={handleChangeForm("team_name")}
          value={values.team_name}
        />
        <TextField
          id="creation_date"
          label="Creation Date"
          variant="standard"
          InputLabelProps={{ shrink: true }}
          type="date"
          name="creation_date"
          onChange={handleChangeForm("creation_date")}
          value={values.creation_date}
        />
        <TextField
          id="eth_addr-basic"
          label="Team Leader Ethereum Address"
          variant="standard"
          name="eth_addr"
          onChange={handleChangeForm("eth_addr")}
          value={values.eth_addr}
        />
        <Button variant="outlined" component="label">
          {values.nameFile}
          <input type="file" name="file" hidden onChange={inputFileHandler} />
        </Button>
        <br />
        <Button variant="contained" color="success" onClick={onClickBtn}>
          Validate
        </Button>
      </Box>
    </Box>
  );
}

export default TeamCreationForm;
