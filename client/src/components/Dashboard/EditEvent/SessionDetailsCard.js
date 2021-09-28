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
import { useDispatch } from "react-redux";
import { fetchParticularSessionOfEvent } from "../../../actions";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { Popup } from "semantic-ui-react";
import SessionMoreInfo from "./FormComponents/EditSessionForms/SessionMoreInfo";

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
  const [openMoreInfo, setOpenMoreInfo] = React.useState(false);

  //  const formatDateAndTime =(date)=>{
  //   var now = new Date();
  //   dateFormat(startDate, "mm/d/yyyy");
  //  }

  const dispatch = useDispatch();

  const handleCloseMoreInfo = () => {
    setOpenMoreInfo(false);
  };

  const handleDeleteSession = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleEditSession = () => {
    dispatch(fetchParticularSessionOfEvent(id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderSessionSpeakersList = (sessionSpeakers) => {
    return sessionSpeakers.map((speaker) => {
      return (
        <Tooltip title={speaker.firstName} aria-label={speaker.firstName}>
          <Avatar
            variant="rounded"
            alt={speaker.name}
            src={`https://bluemeet.s3.us-west-1.amazonaws.com/${speaker.image}`}
          />
        </Tooltip>
      );
    });
  };

  console.log("start time", startTime);
  console.log("end time", endTime);

  const truncateText = (str, n) => {
    return str.length > n ? `${str.substring(0, n)} ...` : str;
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
          <div
            className="event-name-d"
            style={{
              width: "100%",
              fontFamily: "Inter",
              fontSize: "0.85rem",
              display: "inline-block",
            }}
          >
            {/* {name} */}
            {truncateText(name, 35)}
            <IconButton
              onClick={() => {
                setOpenMoreInfo(true);
              }}
              className="ms-1"
            >
              <InfoOutlinedIcon
                style={{ fontSize: "20px", color: "#585858" }}
              />
            </IconButton>
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
            <div
              className="me-3"
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: "0.85rem",
              }}
            >
              {/* dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
              // Saturday, June 9th, 2007, 5:46:21 PM */}
              {dateFormat(startTime, "ddd, mmm dS, yyyy, h:MM:ss TT")}
            </div>
            {/* <div className="me-3">12/07/2021 9:00 AM</div> */}
            <div className="me-3">-</div>
            <div
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: "0.85rem",
              }}
            >
              {/* {dateFormat(endDate, "mm/d/yyyy")}{" "} */}
              {dateFormat(endTime, "ddd, mmm dS, yyyy, h:MM:ss TT")}
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
            <div
              className="chip-text"
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: "0.85rem",
              }}
            >
              {/* Cracking PM Interviews by Microsoft Product Leader */}
              {truncateText(description, 50)}
              {/* {description} */}
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
            {typeof speaker !== "undefined" && speaker.length > 0 ? (
              <div className="session-card-speaker-grid">
                {/* Session speaker List */}
                {renderSessionSpeakersList(speaker)}
              </div>
            ) : (
              <div
                style={{
                  color: "#C92121",
                  fontWeight: "500",
                  fontSize: "0.85rem",
                }}
              >
                No speaker assigned
              </div>
            )}
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
      <SessionMoreInfo open={openMoreInfo} handleClose={handleCloseMoreInfo} />
    </>
  );
};

export default SessionDetailCard;
