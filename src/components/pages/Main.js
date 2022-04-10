import { ListItemText, Typography, List } from "@mui/material";
import { Box } from "@mui/system";

function Main() {
  // const { accounts } = useContext(BlockchainContext);
  // const [address, setAddress]= useState("undefined address");

  // useEffect(() => {
  //   const load = async () => {
  //     const address = accounts[0];
  //     setAddress(address)
  //   };

  //   if (typeof accounts !== "undefined") {
  //     load();
  //   }
  // }, [accounts]);

  return (
    <div>
      <Typography align="center" variant="h3" marginTop={4}>
        Corporate Autonomous Organization (CAO)
      </Typography>
      <Box sx={{  m: 10 }}>
        <Typography variant="subtitle1">
          If you want to take part in the life of your company, if you want to
          gamify your career and those of your colleagues, this site is for you.
          Indeed, you can :
          <ul>
            <li>Earn rewards</li>
            <li>Have a continuous stream of cryptocurrencies</li>
            <li>Earn ethers at the end of each month</li>
            <li>
              Vote and propose improvements or requests to make your company
              grow together
            </li>
          </ul>
        </Typography>
      </Box>
    </div>
  );
}

export default Main;
