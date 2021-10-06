import React, { useEffect, useState } from "react";
import { Divider, alpha, Button } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import ParticipantsListFields from "../GridComponents/Participants/ParticipantsListFields";
import ParticipantsDetailsCard from "../GridComponents/Participants/ParticipantsDetailsCard";
import { useDispatch, useSelector } from "react-redux";
import GetAppIcon from "@material-ui/icons/GetApp";
import SearchIcon from "@material-ui/icons/Search";
import AddParticipantsOptions from "./AddParticipantsOptions";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import { useParams } from "react-router";
import {
  fetchRegistrationsOfParticularEvent,
  sendBulkAttendeeEmail,
} from "./../../../../actions";
import AttendeeBulkInvite from "./AttendeeBulkInvite";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const renderParticipants = (eventRegistrations) => {
  return eventRegistrations.map((el) => {
    return (
      <ParticipantsDetailsCard
        image={
          el.userImage.startsWith("https://")
            ? el.userImage
            : `https://bluemeet.s3.us-west-1.amazonaws.com/${el.userImage}`
        }
        id={el._id}
        key={el._id}
        name={el.userName}
        email={el.userEmail}
        ticketType={el.ticketType}
        totalAmountPaid={el.totalAmountPaid}
        currency={el.currency}
        addedVia={el.addedVia}
        invitationLink={el.invitationLink}
      />
    );
  });
};

const Participants = () => {
  const [openBulkMailConfirmation, setOpenBulkMailConfirmation] =
    React.useState(false);

  const handleCloseBulkMailConfirmation = () => {
    setOpenBulkMailConfirmation(false);
  };

  const params = useParams();

  const eventId = params.id;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRegistrationsOfParticularEvent(eventId));
  }, []);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { registrations } = useSelector((state) => state.registration);
  const { eventDetails } = useSelector((state) => state.event);

  const bulkMailInfo = registrations.map((el) => {
    return {
      name: el.userName,
      email: el.userEmail,
      link: el.invitationLink,
      eventName: eventDetails.eventName,
    };
  });

  const classes = useStyles();

  const processRegistrationData = () => {
    const processedArray = [];

    registrations.map((communityRegistration) => {
      const array = Object.entries(communityRegistration);

      const filtered = array.filter(
        ([key, value]) =>
          key === "userName" ||
          key === "userEmail" ||
          key === "ticketType" ||
          key === "eventName" ||
          key === "addedVia" ||
          key === "invitationLink" ||
          key === "currency" ||
          key === "totalAmountPaid" ||
          key === "createdAt"
      );

      const asObject = Object.fromEntries(filtered);

      processedArray.push(asObject);
    });

    const finalArray = processedArray.map((obj) => Object.values(obj));

    return finalArray;
  };

  const CreateAndDownloadCSV = (data) => {
    var csv =
      "Event name,User Name,User Email,Ticket Type, Total Amount Paid, Currency,   Date & Time of Registration , Added via, Magic link, \n";
    data.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    console.log(csv);
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = "registrations.csv";
    hiddenElement.click();
  };

  return (
    <>
      <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 pb-3">
        <div className="sec-heading-text"></div>
        <div className="sec-heading-action-button d-flex flex-row">
          <div
            className={`${classes.search} me-3`}
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            className={`${classes.button} me-3 btn-outline-text`}
            startIcon={<GetAppIcon />}
            style={{ backgroundColor: "#538BF7" }}
            onClick={() => {
              CreateAndDownloadCSV(processRegistrationData());
              console.log(processRegistrationData());
            }}
          >
            Export
          </Button>
          <button
            onClick={() => {
              // dispatch(sendBulkAttendeeEmail(bulkMailInfo));
              setOpenBulkMailConfirmation(true);
            }}
            className="btn btn-outline-primary btn-outline-text d-flex flex-row align-items-center"
          >
            {" "}
            <MailRoundedIcon className="me-2" /> <span> Send Invites </span>
          </button>
          {/* <button
            onClick={() => {
              setOpen(true);
            }}
            className="btn btn-outline-primary btn-outline-text d-flex flex-row align-items-center"
          >
            {" "}
            <AddRoundedIcon className="me-2" /> <span> Add Participants </span>
          </button> */}
        </div>
      </div>
      <div className="event-management-content-grid px-4 mb-4 py-4">
        <ParticipantsListFields />

        <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
          <Divider />
        </div>
        {renderParticipants(registrations)}
      </div>

      <AddParticipantsOptions open={open} handleClose={handleClose} />
      <AttendeeBulkInvite
        open={openBulkMailConfirmation}
        handleClose={handleCloseBulkMailConfirmation}
        bulkMailInfo={bulkMailInfo}
      />
    </>
  );
};

export default Participants;
