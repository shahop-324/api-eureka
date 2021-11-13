import React, { useState } from "react";

import "./../../../../../assets/Sass/Registrations.scss";
import "./../../../../../assets/Sass/DataGrid.scss";

import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import { useDispatch } from "react-redux";
import MailIcon from "@mui/icons-material/Mail";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PreviewParticipant from "../../HelperComponents/PreviewParticipant";
import { showSnackbar, sendAttendeeInvite } from "./../../../../../actions";
import EditTrack from "../../FormComponents/EditTrackForms/EditTrack";
import DeleteTrack from "../../FormComponents/EditTrackForms/DeleteTrack";

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

const TrackDetailsCard = ({ id, name, description }) => {
  const dispatch = useDispatch();

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  return (
    <>
      <div
        className="registrations-field-value-container"
        style={{ gridTemplateColumns: "2fr 2fr 1fr" }}
      >
        <div className="registrations-email-field">
          <div className="registrations-field-label registrations-field-value-modified">
            {/* {name} */}
            Startups
          </div>
        </div>
        <div className="registrations-phone-field">
          <div className="registrations-field-label registrations-field-value-modified">
            {/* {Description} */}
            This track will have sessions for startups
          </div>
        </div>

        <div className="registrations-amount-field">
          <div className="registrations-field-label registrations-field-value-modified">
            <IconButton
              onClick={() => {
                setOpenEdit(true);
              }}
              color="primary"
              aria-label="edit track"
            >
              <EditRoundedIcon style={{ color: "#1351C5" }} />
            </IconButton>
            <IconButton
              onClick={() => {
                setOpenDelete(true);
              }}
              color="secondary"
              aria-label="edit track"
            >
              <DeleteRoundedIcon style={{ color: "#C74525" }} />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>
      <EditTrack open={openEdit} handleClose={handleCloseEdit} />
      <DeleteTrack open={openDelete} handleClose={handleCloseDelete} />
    </>
  );
};

export default TrackDetailsCard;
