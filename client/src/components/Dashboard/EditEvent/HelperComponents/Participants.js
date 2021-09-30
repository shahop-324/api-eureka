import React, { useState } from "react";
import {
  SwipeableDrawer,
  IconButton,
  Avatar,
  Divider,
  alpha,
  Button,
} from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@mui/icons-material/Add";

import ParticipantsListFields from "../GridComponents/Participants/ParticipantsListFields";
import ParticipantsDetailsCard from "../GridComponents/Participants/ParticipantsDetailsCard";
import { useSelector } from "react-redux";

import GetAppIcon from "@material-ui/icons/GetApp";
import SearchIcon from "@material-ui/icons/Search";
import AddParticipantsOptions from "./AddParticipantsOptions";

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
    // vertical padding + font size from searchIcon
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

const Participants = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  const communityRegistrations = useSelector(
    (state) => state.registration.registrations
  );

  const processRegistrationData = () => {
    const processedArray = [];

    communityRegistrations.map((communityRegistration) => {
      const array = Object.entries(communityRegistration);

      const filtered = array.filter(
        ([key, value]) =>
          key === "userName" ||
          key === "userEmail" ||
          key === "ticketType" ||
          key === "eventName" ||
          key === "userName" ||
          key === "created_by_contact" ||
          key === "razorpayPayId" ||
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
      "Event Name,User Name, Email,Contact,Ticket Type,Transaction Id, Date & Time of Registration \n";
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
            className="btn btn-outline-text btn-outline-primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            <AddIcon style={{ fontSize: "20px" }} className="me-2" />
            <span>Add participants</span>
          </button>

          {/* <div className="ms-3" style={{ minWidth: "250px" }}>
              <Select
                styles={styles}
                menuPlacement="top"
                options={options}
                defaultValue={options[0]}
              />
            </div>

            <div className="ms-3" style={{ minWidth: "250px" }}>
              <Select
                styles={styles}
                menuPlacement="top"
                options={timelineOptions}
                defaultValue={timelineOptions[0]}
              />
            </div> */}
        </div>
      </div>
      <div className="event-management-content-grid px-4 mb-4 py-4">
        <ParticipantsListFields />

        <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
          <Divider />
        </div>
        <ParticipantsDetailsCard />
        <ParticipantsDetailsCard />
        <ParticipantsDetailsCard />
        <ParticipantsDetailsCard />
        <ParticipantsDetailsCard />
      </div>

      <AddParticipantsOptions open={open} handleClose={handleClose} />
    </>
  );
};

export default Participants;
