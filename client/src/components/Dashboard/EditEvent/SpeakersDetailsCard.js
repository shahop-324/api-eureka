import React from "react";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import "./../../../assets/Sass/DataGrid.scss";
import Avatar from "@material-ui/core/Avatar";
import EditSpeaker from "./FormComponents/EditSpeakersForms/EditSpeaker";
import DeleteSpeaker from "./FormComponents/EditSpeakersForms/DeleteSpeaker";
import { fetchParticularSpeakerOfEvent } from "../../../actions";
import { useDispatch } from "react-redux";

import VisibilityIcon from '@mui/icons-material/Visibility';
import MailIcon from '@mui/icons-material/Mail';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SpeakerPreview from "./FormComponents/EditSpeakersForms/SpeakerPerview";
// import { useDispatch } from "react-redux";
// import { fetchParticularSpeakerOfEvent } from "../../../actions";

const SpeakersDetailsCard = ({ name, email, sessions, id, headline, url }) => {
  console.log(sessions);
  console.log(id);

const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  const [openPreview, setOpenPreview] = React.useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  // const dispatch = useDispatch();
  const handleDeleteSpeaker = () => {
    setOpenDeleteDialog(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  }

  const handleCloseDeleteSpeaker = () => {
    setOpenDeleteDialog(false);
  };

  const handleEditSpeaker = () => {
    setOpen(true);
    dispatch(fetchParticularSpeakerOfEvent(id));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const truncateText = (str, n) => {
    return str.length > n ? `${str.substring(0, n)} ...` : str;
  };
  
  return (
    <>
      <div className="session-field-value-container" style={{gridTemplateColumns: "2fr 2.5fr 3fr 2.5fr 2.5fr "}}>
        <div
          className="event-card-field "
          style={{
            width: "100%",
          }}
        >
          <div className="registrations-name-field">
            <div className="registrations-field-label d-flex flex-row justify-content-start">
              {/* attendee avatar and name */}
              <Avatar alt={name} src={url} variant="rounded" />
              <div className="ms-3 px-2 registration-name-styled" style={{fontFamily: "Inter", fontSize: "0.85rem"}}>
                {/* {name} */}
                {truncateText(name, 20)}
              </div>
            </div>
          </div>
          {/* <div className="event-name-d" style={{width: '100%'}}>
            The Craft Workshop
          </div> */}
        </div>
        {/* <div
          className="event-visibility-field"
          style={{
            width: "100%",
          }}
        >
          <div
            className="event-field-label registrations-field-label"
            style={{ width: "100%", fontFamily: "Inter", fontSize: "0.85rem", fontWeight: "500" }}
          >
           
            {truncateText(headline, 25)}
          </div>
        </div> */}
        <div
          className="event-status-field"
          style={{
            width: "100%",
          }}
        >
          <div
            className="event-field-label registrations-field-label"
            style={{ width: "100%" }}
          >
            <div className="chip-text" style={{fontFamily: "Inter", fontSize: "0.85rem", fontWeight: "500"}}>
              {/* {email} */}
              {truncateText(email, 20)}
            </div>
          </div>
        </div>
        <div
          className="event-views-field"
          style={{
            width: "100%",
          }}
        >
          <div className="event-field-label registrations-field-label">
            <div className="speaker-card-session-grid" style={{gridTemplateColumns: "1fr"}}>
              {sessions.map((session) => {
                console.log(session);
                return (
                  <div
                    key={session.id}
                    className="me-3 px-3 py-2 event-name-chip-review"
                    style={{ textAlign: "center", fontFamily: "Inter", fontSize: "0.85rem", fontWeight: "500" }}
                  >
                    {/* {session.name} */}
                    {truncateText(session.name, 35)}
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
        <div
          className="event-visibility-field"
          style={{
            width: "100%",
          }}
        >
          <div
            className="event-field-label registrations-field-label"
            style={{ width: "100%", fontFamily: "Inter", fontSize: "0.85rem", fontWeight: "500" }}
          >
            {"Sent"}
          </div>
        </div>
        <div className="event-registrations-field">
          <div
            className="event-field-label registrations-field-label"
            style={{ width: "100%" }}
          >
            <div onClick={handleEditSpeaker}>
              <IconButton color="primary" aria-label="add to shopping cart">
                <EditRoundedIcon />
              </IconButton>
            </div>
            <div onClick={handleDeleteSpeaker}>
              <IconButton color="secondary" aria-label="add to shopping cart">
                <DeleteRoundedIcon />
              </IconButton>
            </div>
            <div onClick={() => {
              setOpenPreview(true)
            }}>
              <IconButton color="secondary" aria-label="add to shopping cart">
                <VisibilityIcon style={{color: "#A4C513"}} />
              </IconButton>
            </div>
            <div onClick={() => {
              alert("Email invitation sent!")
            }}>
              <IconButton color="secondary" aria-label="add to shopping cart">
                <MailIcon style={{color: "#1351C5"}} />
              </IconButton>
            </div>
            <div onClick={() => {
              alert("Invitation Link copied to clipboard!")
            }}>
              <IconButton color="secondary" aria-label="add to shopping cart">
                <ContentCopyIcon style={{color: "#A113C5"}} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>
      <EditSpeaker open={open} handleClose={handleClose} id={id} />
      <DeleteSpeaker
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteSpeaker={handleCloseDeleteSpeaker}
        id={id}
      />
      <SpeakerPreview open={openPreview} handleClose={handleClosePreview} />
    </>
  );
};

export default SpeakersDetailsCard;
