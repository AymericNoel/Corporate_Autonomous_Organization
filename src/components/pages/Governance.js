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
            { field: "id", headerName: "Id", width: 50 },
            { field: "proposalContent", headerName: "Proposal content", minWidth: 150, flex: 0.2 },
            { field: "status", headerName: "Status", minWidth: 100 },
          ]}
          rows={[
            { id: 1, proposalContent: "This is the first proposal !", status: "Open" },
            { id: 2, proposalContent: "Getting all banks to adopt bitcoin", status: "Close" },
            { id: 3, proposalContent: "Get sunshine every day ", status: "Close" },
            { id: 4, proposalContent: "Make me win", status: "Open" },
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
