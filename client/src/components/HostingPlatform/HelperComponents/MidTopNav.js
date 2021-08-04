import React from "react";
import "./../Styles/root.scss";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Faker from "faker";

import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RightContent from "./RightContent";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const MidTopNav = () => {
  const classes = useStyles();

  return (
    <>
      <div className="mid-top-nav ps-3 py-2 d-flex flex-row justify-content-between align-items-center">
        <div className="event-name-l2">Virtual career fair 2021 India</div>
        <div className="d-flex flex-row">
          <RightContent />
        </div>
      </div>
    </>
  );
};

export default MidTopNav;
