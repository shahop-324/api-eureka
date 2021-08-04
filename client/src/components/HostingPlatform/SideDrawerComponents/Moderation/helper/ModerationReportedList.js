import React from "react";
import Faker from "faker";
import { Avatar } from "@material-ui/core";

import "./../../../Styles/root.scss";
import { makeStyles } from "@material-ui/core";

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

const ModerationReportedList = () => {
  const classes = useStyles();
  return (
    <>
      <div className="people-container pt-2 px-2" style={{ height: "75vh" }}>
        <div className="scrollable-chat-element-container"></div>
      </div>
    </>
  );
};

export default ModerationReportedList;
