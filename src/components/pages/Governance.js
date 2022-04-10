import { Typography, Button, Modal } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import NewProposalForm from "../utils/NewProposalForm";
import ResponseProposalForm from "../utils/ResponseProposalForm";

function Governance() {
  const [addProposalOpen, setAddProposalOpen] = React.useState(false);
  const [voteOpen, setVoteOpen] = React.useState(false);
  const [params, setParams] = React.useState({});

  const VoteOpenModalClose = () => setVoteOpen(false);
  const AddProposalOpenModalOpen = () => setAddProposalOpen(true);
  const AddProposalOpenModalClose = () => setAddProposalOpen(false);

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        component="div"
        sx={{ mx: 4, my: 4 }}
      >
        Governance
      </Typography>
      <Box sx={{ width: 1 / 2, mx: "auto", mb: 4 }}>
        <Button variant="contained" fullWidth onClick={AddProposalOpenModalOpen}>
          Add proposal
        </Button>
      </Box>
      <Box sx={{ height: 300, width: "70%", mx: "auto" }}>
        <DataGrid
          autoHeight
          disableSelectionOnClick
          disableVirtualization
          onRowClick={(params, event) => {
            if (!event.ctrlKey) {
             setVoteOpen(true);
             setParams(params);
            }
          }}
          columns={[
            { field: "col1", headerName: "Column 1", width: 600 },
            { field: "col2", headerName: "Column 2", minWidth: 150, flex: 0.2 },
          ]}
          rows={[
            { id: 1, col1: "Hello", col2: "World" },
            { id: 2, col1: "DataGridPro", col2: "is Awesome" },
            { id: 3, col1: "MUI", col2: "is Amazing" },
          ]}
        />{" "}
      </Box>
      <Modal open={ voteOpen } onClose={VoteOpenModalClose}>
        <div>
          <ResponseProposalForm params={params} />
        </div>
      </Modal>
      <Modal open={addProposalOpen} onClose={AddProposalOpenModalClose}>
        <div>
          <NewProposalForm />
        </div>
      </Modal>
    </div>
  );
}

export default Governance;
