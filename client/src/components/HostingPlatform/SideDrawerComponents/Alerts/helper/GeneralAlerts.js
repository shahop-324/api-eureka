/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Avatar, makeStyles } from "@material-ui/core";
import Faker from "faker";

import "./../Styles/alerts.scss";

import "./../../../Styles/root.scss";
import GroupMeetAlert from "../Sub/GroupMeetAlert";
import OneOnOneMeetAlert from "../Sub/OneOnOneMeetAlert";
import SessionReminder from "../Sub/SessionReminder";
import TableInvitationAlert from "../Sub/TableInvitationAlert";

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
            {/* {renderAlertsList(eventAlerts)} */}

           <GroupMeetAlert />

           <OneOnOneMeetAlert />

           <SessionReminder />

           <TableInvitationAlert />
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralAlerts;
