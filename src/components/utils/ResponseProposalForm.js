import {
  Button,
  Box,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useState, useContext } from "react";
import BlockchainContext from "../../context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

function ResponseProposalForm(props) {
  const { accounts, contracts } = useContext(BlockchainContext);
  const [values, setValues] = useState({
    vote: 0,
  });

  const handleChangeForm = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const onClickBtn = async () => {
    try {
      await contracts.CaoContract.methods
        .castVote(props.params.id, values.vote)
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
        handleChangeForm={handleChangeForm}
      >
        <FormLabel id="demo-radio-buttons-group-label">Choice for proposal n°{props.params.id}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="Abstain"
          name="radio-buttons-group"
          sx={{ my: 4 }}
          value={values.vote}
        >
          <FormControlLabel
            value="0"
            control={<Radio />}
            label="Against"
            onChange={handleChangeForm("vote")}
          />
          <FormControlLabel
            value="1"
            control={<Radio />}
            label="For"
            onChange={handleChangeForm("vote")}
          />
          <FormControlLabel
            value="2"
            control={<Radio />}
            label="Abstain"
            onChange={handleChangeForm("vote")}
          />
        </RadioGroup>
        <div>
          <Button variant="contained" color="success" onClick={onClickBtn}>
            Submit
          </Button>
        </div>
      </Box>
    </Box>
  );
}

export default ResponseProposalForm;
