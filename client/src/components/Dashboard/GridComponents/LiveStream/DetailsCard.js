import React from "react";
import "./../../../../assets/Sass/DataGrid.scss";
import "./../../../../assets/Sass/TeamManagement.scss";
import IconButton from "@material-ui/core/IconButton";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import Divider from "@material-ui/core/Divider";
import Chip from "@mui/material/Chip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import DeleteStreamDestination from "../../FormComponents/StreamDestinations.js/DeleteDestination";
import EditRTMPDestination from "../../FormComponents/StreamDestinations.js/EditRTMPDestination";

const LiveStreamDetailsCard = () => {
  const [openDeleteVideo, setOpenDeleteVideo] = React.useState(false);
  const [openEditRTMP, setOpenEditRTMP] = React.useState(false);

  const handleCloseDeleteVideo = () => {
    setOpenDeleteVideo(false);
  };

  const handleCloseEditRTMP = () => {
    setOpenEditRTMP(false);
  }

  return (
    <>
      <div className="team-members-list-fields-container">
        <div className="registrations-name-field">
          <div className="registrations-field-label mx-5">
            <VideocamRoundedIcon
              style={{ color: "#538BF7" }}
              className="me-2"
            />
            Facebook
          </div>
        </div>
        <div className="registrations-email-field">
          <div className="registrations-field-label">
            <Chip label="Custom RTMP" color="warning" />
          </div>
        </div>
        <div className="registrations-phone-field">
          <div className="registrations-field-label">
            <Chip label="Session" color="primary" variant="outlined" />
          </div>
        </div>
        <div className="registrations-invoice-field">
          <div className="registrations-field-label">
            <div onClick={() => {
              setOpenEditRTMP(true);
            }}>
              <IconButton color="primary" aria-label="add to shopping cart">
                <ModeEditOutlineRoundedIcon />
              </IconButton>
            </div>
            <div>
              <IconButton aria-label="add to shopping cart">
                <ContentCopyIcon style={{ color: "#DA580D" }} />
              </IconButton>
            </div>
            <div onClick={() => {setOpenDeleteVideo(true)}}>
              <IconButton color="secondary" aria-label="add to shopping cart">
                <DeleteRoundedIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>

      <EditRTMPDestination open={openEditRTMP} handleClose={handleCloseEditRTMP} />

      <DeleteStreamDestination
        open={openDeleteVideo}
        handleClose={handleCloseDeleteVideo}
      />
    </>
  );
};

export default LiveStreamDetailsCard;
