import { TextField, Button, Box } from "@mui/material";
import { NFTStorage, File } from "nft.storage";
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
    nameFile: "Upload NFT Image Team Leader (jpg or png)",
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
    const image = await fileFromPath(fileContent, fileName);

    const nftstorage = new NFTStorage({
      token: process.env.REACT_APP_NFT_STORAGE_TOKEN,
    });

    const description = "NFT for team member in CAO";
    const name = fileName;
    return nftstorage.store({
      image,
      name,
      description,
    });
  };

  const fileFromPath = async (fileContent, fileName) => {
    const extension = fileName.substr(-3);
    return new File([fileContent], fileName, { type: `image/${extension}` });
  };

  const inputFileHandler = (event) => {
    try {
      const nameFile = event.target.files[0].name;
      console.log(nameFile);
      const fileReader = new FileReader();
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const nft = e.target.result;
          setValues({ ...values, inputFile: nft, nameFile });
        } catch (error) {
          console.log(error);
        }
      };
    } catch (error) {
      setValues({ ...values, nameFile: "Upload NFT Image Team Leader" });
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
