import React from "react";
import { Avatar, IconButton, makeStyles } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import Faker from "faker";

import "./../../Styles/root.scss";
import PollComponent from "./helper/PollComponent";
import CreateNewPollForm from "./helper/CreateNewPollForm";
// import { PollComponent } from "./helper/PollComponent";

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

const PollsMainComponent = (props) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleCreateNewPoll = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between mb-2">
          <div className="event-platform-side-drawer-heading">Polls</div>

          <div
            onClick={() => {
              props.resetSelectedTab();
              props.setOpenDrawer(false);
            }}
          >
            <IconButton aria-label="close-drawer">
              <CancelOutlinedIcon
                style={{ fontSize: "18", color: "#4D4D4D" }}
              />
            </IconButton>
          </div>
        </div>

        {/* here comes people component */}

        <div className="people-container pt-2 px-2">
          {/* <div className="search-box-and-view-switch-container d-flex flex-row justify-content-between mb-3"></div> */}

          <div className="scrollable-chat-element-container">
            {/* <PollComponent /> */}
            <PollComponent />
          </div>

          <div className="chat-msg-input-container d-flex flex-row justify-content-between">
            <button
              type="button"
              onClick={() => {
                handleCreateNewPoll();
              }}
              className="btn btn-primary btn-outline-text"
              style={{ width: "100%" }}
            >
              Create a poll
            </button>
          </div>
        </div>
      </div>
      <CreateNewPollForm open={open} handleClose={handleClose} />
    </>
  );
};

export default PollsMainComponent;
