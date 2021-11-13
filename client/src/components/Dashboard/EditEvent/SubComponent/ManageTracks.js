import React from "react";
import styled from "styled-components";

import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AddTrack from "../FormComponents/EditTrackForms/AddTrack";
import TrackListFields from "../GridComponents/Track/ListFields";
import TrackDetailsCard from "../GridComponents/Track/DetailsCard";

const Container = styled.div`
  height: 600px;
  width: 900px;
`;

const Heading = styled.div`
  font-weight: 500;
  font-size: 1rem;
  color: #212121;
`;

const ManageTracks = ({ open, handleClose }) => {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [openAddTrack, setOpenAddTrack] = React.useState(false);

  const handleCloseAddTrack = () => {
      setOpenAddTrack(false);
  }

  return (
    <>
      <Dialog
        maxWidth="600px"
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={handleClose}
      >
        <Container className="px-4">
          <div
            style={{ borderBottom: "1px solid #B3B3B3" }}
            className="d-flex flex-row align-items-center justify-content-between py-3"
          >
            <Heading>Manage tracks</Heading>
            <div className="d-flex flex-row align-items-center">
              <button onClick={() => {
                  setOpenAddTrack(true);
              }} className="btn btn-outline-text btn-outline-primary me-3">
                Add track
              </button>
              <IconButton
                onClick={() => {
                  handleClose();
                }}
              >
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </div>
          <TrackListFields />
          <TrackDetailsCard />
        </Container>
      </Dialog>

<AddTrack open={openAddTrack} handleClose={handleCloseAddTrack} />

    </>
  );
};

export default ManageTracks;
