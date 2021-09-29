import React from "react";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import "./../../../assets/Sass/DataGrid.scss";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import EditBooth from "./FormComponents/EditBoothsForms/EditBooth";
import DeleteBooth from "./FormComponents/EditBoothsForms/DeleteBooth";
import { useDispatch } from "react-redux";
import { fetchBooth } from "../../../actions";
import MailIcon from "@mui/icons-material/Mail";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import styled from "styled-components";
import Draggable from "react-draggable"; // Draggable and Draggable core

const OrderNumber = styled.span`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;
  color: #212121;
`;


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const BoothDetailsCard = (props) => {
  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const dispatch = useDispatch();

  //  const formatDateAndTime =(date)=>{
  //   var now = new Date();
  //   dateFormat(startDate, "mm/d/yyyy");
  //  }

  const handleDeleteBooth = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteBooth = () => {
    setOpenDeleteDialog(false);
  };

  const handleEditBooth = () => {
    // dispatch(fetchParticularSessionOfEvent(id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  const truncateText = (str, n) => {
    return str.length > n ? `${str.substring(0, n)} ...` : str;
  };

  return (
    <>
    <Draggable axis="y">
      <div>
      <div className="session-field-value-container" style={{gridTemplateColumns: "1fr 4fr 3.5fr 2.5fr 3fr", alignItems: "center"}}>
      <div>
              <DragIndicatorIcon className="me-3 drag" />
              <OrderNumber>1</OrderNumber>
            </div>
        <div
          className="event-card-field "
          style={{
            width: "100%",
          }}
        >
          
          <div className="registrations-name-field">
            <div className="registrations-field-label d-flex flex-row justify-content-start">
              {/* attendee avatar and name */}
              <Avatar
                alt={props.name}
                src={props.url}
                variant="rounded"
                className={classes.large}
              />
              <div className="ms-3 px-2 registration-name-styled" style={{fontFamily: "Inter"}}>
                {/* {props.name} */}
                {truncateText(props.name, 25)}
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
            style={{ width: "100%", fontFamily: "Inter" }}
          >
            
            {truncateText(props.tagline, 35)}
          </div>
        </div> */}
        <div
          className="event-status-field"
          style={{
            width: "100%",
          }}
        >
          <div
            className="event-field-label registrations-field-label d-flex flex-column align-items-start"
            style={{ width: "100%" }}
          >
            {props.emails.map((email) => {
              return <div className="chip-text mb-2" style={{fontFamily: "Inter"}}>
                {/* {email} */}
                {truncateText(email, 20)}
                </div>;
            })}
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
              {props.boothTags.map((boothTag) => {
                return (
                  <div
                    className="me-3 px-3 py-2 event-name-chip-review"
                    style={{ textAlign: "center", fontFamily: "Inter" }}
                  >
                    {/* {boothTag} */}
                    {truncateText(boothTag, 35)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="event-registrations-field">
          <div
            className="event-field-label registrations-field-label"
            style={{ width: "100%" }}
          >
            <div
              onClick={() => {
                dispatch(fetchBooth(props.id));
                handleEditBooth();
              }}
            >
              <IconButton color="primary" aria-label="add to shopping cart">
                <EditRoundedIcon />
              </IconButton>
            </div>
            <div onClick={handleDeleteBooth}>
              <IconButton color="secondary" aria-label="add to shopping cart">
                <DeleteRoundedIcon />
              </IconButton>
            </div>
            <div
                  onClick={() => {
                    alert("Email invitation sent!");
                  }}
                >
                  <IconButton
                    color="secondary"
                    aria-label="add to shopping cart"
                  >
                    <MailIcon style={{ color: "#1351C5" }} />
                  </IconButton>
                </div>
                <div
                  onClick={() => {
                    alert("Invitation Link copied to clipboard!");
                  }}
                >
                  <IconButton
                    color="secondary"
                    aria-label="add to shopping cart"
                  >
                    <ContentCopyIcon style={{ color: "#A113C5" }} />
                  </IconButton>
                </div>
          </div>
        </div>
      </div>

      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>
      </div>
      </Draggable>

      <EditBooth open={open} handleClose={handleClose} id={props.id}  />
      <DeleteBooth
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteBooth={handleCloseDeleteBooth}
        id={props.id}
      />
    </>
  );
};

export default BoothDetailsCard;
