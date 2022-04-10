import AppBarComponent from "./components/utils/Menu";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./components/Routes";
import { InitSwAuth, SwTheme } from "@skill-wallet/auth";
import BlockchainContext from "./context";
import BlockchainUtils from "./components/utils/BlockchainUtils";
import { useEffect, useState } from "react";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contracts, setContracts] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      try {
        const tempWeb3 = await BlockchainUtils.getWeb3();
        const tempAccounts = await BlockchainUtils.getAccounts(tempWeb3);
        const tempContracts = await BlockchainUtils.getContracts(tempWeb3);

        setWeb3(tempWeb3);
        setAccounts(tempAccounts);
        setContracts(tempContracts);
      } catch (error) {
        console.error("Failed to load web3, accounts, or contract!\n", error);
      }
    };

    init();
  }, []);

  return (
    <div>
      <BlockchainContext.Provider value={{ web3, accounts, contracts }}>
        <Router>
          <AppBarComponent />
          <AppRoutes />
        </Router>
      </BlockchainContext.Provider>
    </div>
  );
}
InitSwAuth();

export default App;
