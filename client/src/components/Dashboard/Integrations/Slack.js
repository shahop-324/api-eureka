import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "./Styles/IntegrationCard.scss";

import { makeStyles } from "@material-ui/core/styles";
import SlackAuth from "./Forms/SlackAuth";

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
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}));

const Slack = () => {

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const classes = useStyles();

  return (
    <>
      <div className="integration-card-container px-4 py-3 mb-4">
        <div
          className=""
          style={{ display: "grid", gridTemplateColumns: "0.7fr 8fr 0.7fr" }}
        >
          <Avatar
            src={
              "https://preview.redd.it/ar87gdk7atk51.png?auto=webp&s=d02a24204684382ba2ca4d79aeeef902ab007f3d"
            }
            alt={"Mailchimp"}
            className={classes.large}
            variant="rounded"
          />
          <div>
            <div className="integration-name mb-2">Slack</div>
            <div className="integration-short-description">
              Get your team to know about what's happening in your event and engage in real time for high value actions.
            </div>
          </div>

          <div className="d-flex flex-row align-items-center" style={{ justifySelf: "end" }}>
          <button type="button" class="btn btn-primary btn-outline-text me-3" >Upgrade</button>
            <button
              onClick={() => {
                handleOpen();
              }}
              className="btn btn-outline-primary btn-outline-text"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <SlackAuth openDrawer={open}  handleCloseDrawer={handleClose} />
    </>
  );
};

export default Slack;
