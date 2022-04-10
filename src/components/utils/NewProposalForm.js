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
  const { accounts, contracts } = useContext(BlockchainContext);
  const [values, setValues] = useState({
    description: "",
  });

  const handleChangeForm = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const onClickBtn = async () => {
    try {
      await contracts.CaoContract.methods
        .propose([], [0], [], values.description)
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
