/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Avatar, makeStyles } from "@material-ui/core";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import "./../../../Styles/root.scss";
import CreateAlert from "./../../../CreateAlert";
import { useDispatch, useSelector } from "react-redux";
import {
  errorTrackerForFetchPreviousEventAlerts,
  fetchPreviousEventAlerts,
} from "../../../../../actions";
import { useParams } from "react-router-dom";
import DeleteAlert from "./DeleteAlert";

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

const EventAlertComponent = ({ alert }) => {
  const [visibility, setVisibility] = useState("none");

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const classes = useStyles();

  const handleDeleteAlert = () => {
    setOpenDeleteAlert(true);
  };

  const handleCloseDeleteAlert = () => {
    setOpenDeleteAlert(false);
  };

  return (
    <>
      <div
        className="alert-element-container px-2 py-2 mb-3"
        onMouseEnter={() => {
          setVisibility("inline-block");
        }}
        onMouseLeave={() => {
          setVisibility("none");
        }}
      >
        <div
          className="chat-msg-hover-elm flex-row align-items-center justify-content-between px-2 py-1"
          style={{ display: visibility }}
        >
          <DeleteOutlineRoundedIcon
            onClick={() => {
              handleDeleteAlert();
            }}
            className="chat-msg-hover-icon"
            style={{ display: visibility }}
          />
        </div>
        <div className="p-2 d-flex flex-row align-items-center mb-2">
          <Avatar
            src={
              alert.userId.image
                ? alert.userId.image.startsWith("https://")
                  ? alert.userId.image
                  : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${alert.userId.image}`
                : "#"
            }
            alt={alert.userId.firstName}
            variant="rounded"
            className={classes.large}
          />
          <div className="ms-3">
            <div className="d-flex flex-row align-items-center">
              <div className="alert-from-text me-1">From</div>
              <div className="host-name">
                {alert.userId.firstName + " " + alert.userId.lastName}
              </div>
            </div>
            <div className="alert-text">{alert.alertMsg}</div>
          </div>
        </div>
      </div>

      <DeleteAlert
        id={alert._id}
        open={openDeleteAlert}
        handleClose={handleCloseDeleteAlert}
      />
    </>
  );
};

const renderAlertsList = (eventAlerts) => {
  if (!eventAlerts) return;
  return eventAlerts
    .slice(0)
    .reverse()
    .map((alert) => {
      if (!alert.userId) return <></>;
      return <EventAlertComponent alert={alert} />;
    });
};

const EventAlerts = (props) => {
  const dispatch = useDispatch();
  const params = useParams();

  const eventId = params.eventId;

  const [openCreateAlert, setOpenCreateAlert] = useState(false);

  const handleCloseCreateAlert = () => {
    setOpenCreateAlert(false);
  };

  useEffect(() => {
    dispatch(fetchPreviousEventAlerts(eventId));
  }, []);

  const { isLoading, error, eventAlerts } = useSelector(
    (state) => state.eventAlert
  );

  if (error) {
    dispatch(errorTrackerForFetchPreviousEventAlerts());
    return null;
  }

  return (
    <>
      <div>
        <div className="people-container pt-2 px-2" style={{ height: "69vh" }}>
          <div className=" mb-3" style={{ height: "69vh" }}>
            {renderAlertsList(eventAlerts)}
          </div>

          <div className="chat-msg-input-container d-flex flex-row justify-content-between">
            <button
              type="button"
              onClick={() => {
                setOpenCreateAlert(true);
              }}
              className="btn btn-primary btn-outline-text"
              style={{ width: "100%" }}
            >
              Create an alert
            </button>
          </div>
        </div>
      </div>

      <CreateAlert
        open={openCreateAlert}
        handleClose={handleCloseCreateAlert}
      />
    </>
  );
};

export default EventAlerts;
