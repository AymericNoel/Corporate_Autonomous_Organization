import { TextField, Button, Box } from "@mui/material";
import { useState, useContext } from "react";
import { NFTStorage, File } from "nft.storage";
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

function MintForm(props) {
  const { accounts, contracts,web3 } = useContext(BlockchainContext);
  const [values, setValues] = useState({
    eth_addr: "",
    team_id: "",
    token_amount: "",
    inputFile: null,
    nameFile: "Upload NFT Image",
  });

  const handleChangeForm = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const onClickBtn = async () => {
    const metadata = await storeNFT(values.inputFile, values.nameFile);
    try {
      if (props.team) {
        await contracts.TeamContract.methods
          .mint(values.eth_addr, values.team_id, metadata.url)
          .send({ from: accounts[0] });
      } else {
        await contracts.TeamContract.methods
          .RewardContract(values.eth_addr, web3.utils.toWei(values.token_amount.toString()), metadata.url)
          .send({ from: accounts[0] });
      }
      console.log(metadata);
    } catch (error) {
      alert("Transaction failed");
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
          id="eth_addr"
          label="Recipient Ethereum Address"
          variant="standard"
          name="eth_addr"
          onChange={handleChangeForm("eth_addr")}
          value={values.eth_addr}
        />
        {props.team && (
          <TextField
            id="team_id"
            label="Team number"
            variant="standard"
            type="number"
            name="team_id"
            onChange={handleChangeForm("team_id")}
            value={values.team_id}
          />
        )}
        {props.reward && (
          <TextField
            id="token_amount"
            label="ERC20 amount to mint"
            variant="standard"
            type="number"
            name="token_amount"
            onChange={handleChangeForm("token_amount")}
            value={values.token_amount}
          />
        )}
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

export default MintForm;
