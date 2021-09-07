/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Avatar, makeStyles } from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";

import Loader from "./../../../../Loader";

import "./../../../Styles/root.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  errorTrackerForFetchPreviousEventAlerts,
  fetchPreviousEventAlerts,
} from "../../../../../actions";
import { useParams } from "react-router-dom";

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

const GeneralAlerts = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const params = useParams();

  const eventId = params.eventId;

  useEffect(() => {
    dispatch(fetchPreviousEventAlerts(eventId));
  }, []);

  const { isLoading, error, eventAlerts } = useSelector(
    (state) => state.eventAlert
  );

  const renderAlertsList = (eventAlerts) => {
    if (!eventAlerts) return;
    return eventAlerts
      .slice(0)
      .reverse()
      .map((alert) => {
        return (
          <div
            className="alert-element-container px-2 py-2 mb-3"
          >
            <div className="p-2 d-flex flex-row align-items-center mb-2">
              <Avatar
                src={alert.hostImage}
                alt={alert.hostFirstName}
                variant="rounded"
                className={classes.large}
              />
              <div className="ms-3">
                <div className="d-flex flex-row align-items-center">
                  <div className="alert-from-text me-1">From</div>
                  <div className="host-name">
                    {alert.hostFirstName + " " + alert.hostLastName}
                  </div>
                </div>
                <div className="alert-text">{alert.alertMsg}</div>
              </div>
            </div>
          </div>
        );
      });
  };

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    alert(error);
    dispatch(errorTrackerForFetchPreviousEventAlerts());
    return null;
  }

  return (
    <>
      <div>
        <div className="people-container pt-2 px-2" style={{ height: "73vh" }}>
          {/* <div className="search-box-and-view-switch-container d-flex flex-row justify-content-between mb-3"></div> */}

          <div
            className="scrollable-chat-element-container mb-3"
            style={{ height: "69vh" }}
          >
            {/* {isLoading ? :} */}
            {renderAlertsList(eventAlerts)}
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralAlerts;
