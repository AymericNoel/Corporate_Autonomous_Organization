import { TextField, Button, Box } from "@mui/material";
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

function SendTokenForm() {
  const { accounts, contracts, web3 } = useContext(BlockchainContext);
  const [values, setValues] = useState({
    flow_rate: "0",
    eth_addr: "",
    amount: 0,
    rate_month: "",
    wrap: 0,
  });

  const handleChangeForm = (name) => (event) => {
    if (name == "flow_rate") {
      const monthlyAmount = web3.utils.fromWei(event.target.value);
      console.log(monthlyAmount);
      const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
      console.log(calculatedFlowRate);

      setValues({
        ...values,
        rate_month: calculatedFlowRate.toString(),
        flow_rate: event.target.value,
      });
    } else {
      setValues({ ...values, [name]: event.target.value });
    }
  };

  const onClickBtn = async () => {
    try {
      if (values.amount !== 0) {
        await contracts.CaoToken.methods
        .mint(values.eth_addr, web3.utils.toWei(values.amount))
        .send({ from: accounts[0] });
      } else {
        //begin flow rate
      }
    } catch (error) {
      alert("error during Tx");
      console.log(error);
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
          id="eth_addr-basic"
          label="Ethereum Address"
          variant="standard"
          name="eth_addr"
          onChange={handleChangeForm("eth_addr")}
          value={values.eth_addr}
        />
        <TextField
          id="flow_rate"
          label="Enter a flowRate in wei/second"
          variant="standard"
          name="flow_rate"
          onChange={handleChangeForm("flow_rate")}
          value={values.flow_rate}
        />
        <TextField
          id="amount"
          label="Amount if not flow"
          variant="standard"
          type="number"
          name="amount"
          onChange={handleChangeForm("amount")}
          value={values.amount}
        />
        <TextField
          id="wrap"
          label="Amount to wrap"
          variant="standard"
          type="number"
          name="wrap"
          onChange={handleChangeForm("wrap")}
          value={values.wrap}
        />
        <div>
          <p>Your flow will be equal to:</p>
          <p>
            <b>${values.rate_month !== " " ? values.rate_month : 0}</b>{" "}
            CAO/month
          </p>
        </div>
        <br />
        <Button variant="contained" color="success" onClick={onClickBtn}>
          Validate
        </Button>
        <Button variant="contained" color="success">
          Approve tokens to be wrapped
        </Button>
        <Button variant="contained" color="success">
          wrap to fluid tokens
        </Button>
      </Box>
    </Box>
  );
}

export default SendTokenForm;
