import React from "react";
import { Avatar, IconButton, makeStyles } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import Faker from "faker";

import "./../../Styles/root.scss";
import CreateNewAlertForm from "./helper/CreateNewAlertForm";

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

const AlertMainComponent = (props) => {
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();


  const handleNewAlert = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between mb-2">
          <div className="event-platform-side-drawer-heading">Alerts</div>

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
            <div className="alert-element-container px-2 py-2 mb-3">
              <div className="p-2 d-flex flex-row justify-content-between align-items-center mb-2">
                <Avatar
                  src={Faker.image.avatar()}
                  alt="host-name"
                  variant="rounded"
                  className={classes.large}
                />
                <div className="ms-3">
                  <div className="d-flex flex-row align-items-center">
                    <div className="alert-from-text me-1">From</div>
                    <div className="host-name">{Faker.name.findName()}</div>
                  </div>
                  <div className="alert-text">
                    Workshop 2 is about to begin, everyone is requested to join
                    ASAP.
                  </div>
                </div>
              </div>

              <button
                className="btn btn-outline-text btn-outline-primary"
                style={{ width: "100%" }}
              >
                Join
              </button>
            </div>

            <div className="alert-element-container px-2 py-2 mb-3">
              <div className="p-2 d-flex flex-row justify-content-between align-items-center mb-2">
                <Avatar
                  src={Faker.image.avatar()}
                  alt="host-name"
                  variant="rounded"
                  className={classes.large}
                />
                <div className="ms-3">
                  <div className="d-flex flex-row align-items-center">
                    <div className="alert-from-text me-1">From</div>
                    <div className="host-name">{Faker.name.findName()}</div>
                  </div>
                  <div className="alert-text">
                    Digital Marketing session is postponed to friday.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="chat-msg-input-container d-flex flex-row justify-content-between">
            <button
            type="button"
            onClick={() => {
              handleNewAlert();
            }}
              className="btn btn-primary btn-outline-text"
              style={{ width: "100%" }}
            >
              Create an alert
            </button>
          </div>
        </div>
      </div>
      <CreateNewAlertForm open={open} handleClose={handleClose}/>
    </>
  );
};

export default AlertMainComponent;