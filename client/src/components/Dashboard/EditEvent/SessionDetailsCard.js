import React from "react";
// import Faker from "faker";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import "./../../../assets/Sass/DataGrid.scss";
import Avatar from "@material-ui/core/Avatar";
import EditSession from "./FormComponents/EditSessionForms/EditSession";
import DeleteSession from "./FormComponents/EditSessionForms/DeleteSession";
import { Tooltip } from "@material-ui/core";

var dateFormat = require("dateformat");
//var now = new Date();

// Basic usage
//dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
// Saturday, June 9th, 2007, 5:46:21 PM
const SessionDetailCard = ({
  endTime,
  startTime,
  name,
  startDate,
  endDate,
  description,
  speaker,
  id,
}) => {
  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  //  const formatDateAndTime =(date)=>{
  //   var now = new Date();
  //   dateFormat(startDate, "mm/d/yyyy");
  //  }

  const handleDeleteSession = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };



  const handleEditSession = () => {
    //dispatch(fetchParticularSessionOfEvent(id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const truncateText = (str, n) => {
  //   return str > n ? `${str.subString(0,n)} + ...` : str;
  // }

  const renderSessionSpeakersList = (sessionSpeakers) => {
    return sessionSpeakers.map((speaker) => {
      return (
        <Tooltip title={speaker.firstName} aria-label={speaker.firstName}>
          <Avatar
          variant="rounded"
            alt={speaker.name}
            src={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${speaker.image}`}
          />
        </Tooltip>
      );
    });
  };

  return (
    <>
      <div className="session-field-value-container" id={id}>
        <div
          className="event-card-field "
          style={{
            width: "100%",
          }}
        >
          <div className="event-name-d" style={{ width: "100%", fontFamily: "Inter" }}>
            {name}
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
            style={{ width: "100%" }}
          >
            <div className="me-3" style={{fontFamily: "Inter"}}>
              {dateFormat(startDate, "mm/d/yyyy")}{" "}
              {dateFormat(startTime, "h:MM TT")}
            </div>
            {/* <div className="me-3">12/07/2021 9:00 AM</div> */}
            <div className="me-3">-</div>
            <div style={{fontFamily: "Inter"}}>
              {dateFormat(endDate, "mm/d/yyyy")}{" "}
              {dateFormat(endTime, "h:MM TT")}
            </div>{" "}
          </div>
        </div>
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
            <div className="chip-text" style={{fontFamily: "Inter"}}>
              {/* Cracking PM Interviews by Microsoft Product Leader */}

              {description}
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
            <div className="session-card-speaker-grid">
              {/* Session speaker List */}
              {renderSessionSpeakersList(speaker)}
            </div>
          </div>
        </div>
        <div className="event-registrations-field">
          <div
            className="event-field-label registrations-field-label"
            style={{ width: "100%" }}
          >
            <div onClick={handleEditSession}>
              <IconButton color="primary" aria-label="add to shopping cart">
                <EditRoundedIcon />
              </IconButton>
            </div>
            <div onClick={handleDeleteSession}>
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
      <EditSession open={open} handleClose={handleClose} id={id} />
      <DeleteSession
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        id={id}
      />
    </>
  );
};

export default SessionDetailCard;
