import React, { useState, useEffect } from "react";
import socket from "./../../../service/socket";
import ActionConfirmation from "./../Sub/ActionConfirmation";
import { useParams } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import "./../../../Styles/root.scss";
import { makeStyles } from "@material-ui/core";
import ReportActions from "../Sub/ReportActions";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { fetchEventRegistrations } from "./../../../../../actions";

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
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

const PeopleComponent = ({
  name,
  image,
  organisation,
  designation,
  userId,
  blocked,
}) => {
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const params = useParams();
  const eventId = params.eventId;

  const handleClose = () => {
    setOpen(false);
  };

  const { userDetails } = useSelector((state) => state.user);
  const myId = userDetails._id;

  return (
    <>
      <div className="alert-element-container px-2 py-2 mb-3">
        <div className="p-2 d-flex flex-row  align-items-center mb-2">
          <Avatar
            src={
              image
                ? image.startsWith("https://")
                  ? image
                  : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${image}`
                : ""
            }
            alt={name}
            variant="rounded"
            className={classes.large}
          />
          <div className="ms-3">
            <div className="d-flex flex-row align-items-center">
              <div></div>
              <div className="alert-from-text me-1">{name}</div>
            </div>
            <div className="alert-text">
              {designation} {organisation}
            </div>
          </div>
        </div>

        {blocked ? (
          <button
            onClick={() => {
              // handleOpenActions();
              socket.emit("acceptInEvent", {
                userId,
                myId: myId,
                eventId: eventId,
              });
            }}
            className="btn btn-outline-text btn-outline-success"
            style={{ width: "100%" }}
          >
            Accept
          </button>
        ) : (
          <button
            onClick={() => {
              // handleOpenActions();
              setOpen(true);
            }}
            className="btn btn-outline-text btn-outline-danger"
            style={{ width: "100%" }}
          >
            Suspend
          </button>
        )}
      </div>
      <ActionConfirmation
        name={name}
        image={image}
        organisation={organisation}
        designation={designation}
        openDrawer={open}
        handleCloseDrawer={handleClose}
        intent={"suspendOnly"}
        senderId={userId}
      />
    </>
  );
};

const renderPeople = (people) => {
  return people.map((person) => {
    return (
      <PeopleComponent
        name={person.name}
        image={person.image}
        organisation={person.organisation}
        designation={person.designation}
        userId={person.userId}
        blocked={person.blocked}
      />
    );
  });
};

const ModerationPeopleList = () => {
  const params = useParams();
  const eventId = params.eventId;
  const dispatch = useDispatch();

  const [openActions, setOpenActions] = useState(false);

  const { registrations } = useSelector((state) => state.registration);

  const { eventDetails } = useSelector((state) => state.event);

  const blockedIds = eventDetails ? eventDetails.blocked : [];

  const handleOpenActions = () => {
    setOpenActions(true);
  };
  const handleCloseActions = () => {
    setOpenActions(false);
  };

  const classes = useStyles();

  let people = [];
  let uniqueIds = [];

  for (let element of registrations) {
    if (element.bookedByUser) {
      if (!uniqueIds.includes(element.bookedByUser)) {
        people.push({
          userId: element.bookedByUser,
          name: element.userName,
          email: element.userEmail,
          image: element.image,
          blocked: blockedIds.includes(element.bookedByUser) ? true : false,
          designation: element.designation,
          organisation: element.organisation,
        });
        uniqueIds.push(element.bookedByUser);
      }
    }
  }

  useEffect(() => {
    dispatch(fetchEventRegistrations(eventId));
  }, []);

  return (
    <>
      <div className="people-container pt-2 px-2" style={{ height: "auto", minHeight: "75vh" }}>
        <div className="ui icon input mb-3" style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="Search people..."
            className="form-control"
          />
          <SearchRoundedIcon
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              color: "#757575",
            }}
          />
        </div>
        {/* <div className="search-box-and-view-switch-container d-flex flex-row justify-content-between mb-3"></div> */}

        <div className="scrollable-chat-element-container">
          {/* {} */}

          {renderPeople(people)}
        </div>
      </div>

      <ReportActions open={openActions} handleClose={handleCloseActions} />
    </>
  );
};

export default ModerationPeopleList;
