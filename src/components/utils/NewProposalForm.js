import { Button, Box, TextField } from "@mui/material";
import { useState, useContext } from "react";
import BlockchainContext from "../../context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

function NewProposalForm() {
  const { accounts, contracts, web3 } = useContext(BlockchainContext);
  const [values, setValues] = useState({
    description: "",
  });

  const handleChangeForm = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const onClickBtn = async () => {
    try {
      const tokenAddress = contracts.CaoToken._address;
      const callData = web3.eth.abi.encodeFunctionSignature({
        name: 'transfer',
        type: 'function',
        inputs: [{
            type: 'address',
            name: '0x3f0644F31A4C5359DA034954600d8a1dE4ad5df4'
        },{
            type: 'uint256',
            name: '50'
        }]
    })

      await contracts.CaoContract.methods
        .propose([tokenAddress], [0], [callData], values.description)
        .send({ from: accounts[0] });
    } catch (error) {
      alert("Error from Tx");
      console.log(error)
    }
  };

  return (
    <Box sx={style}>
      <Box
        component="form"
        sx={{
          textAlign: "center",
          p: 4,
        }}
        noValidate
        autoComplete="off"
        values={values}
        handleChangeForm={handleChangeForm}
      >
        <TextField
          id="description"
          label="Proposal subject"
          variant="standard"
          type="text"
          name="description"
          fullWidth
          multiline
          sx={{ mb: 4 }}
          onChange={handleChangeForm("description")}
          value={values.description}
        />
        <Button variant="contained" color="success" onClick={onClickBtn}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default NewProposalForm;
