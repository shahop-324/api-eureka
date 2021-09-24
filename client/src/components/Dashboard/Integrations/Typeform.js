import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "./Styles/IntegrationCard.scss";

import { makeStyles } from "@material-ui/core/styles";
import TypeformEnable from "./Forms/TypeformEnable";

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

const Typeform = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <>
      <div className="integration-card-container px-4 py-3 mb-4">
        <div
          className=""
          style={{ display: "grid", gridTemplateColumns: "0.7fr 8fr 0.7fr" }}
        >
          <Avatar
            src={"https://tripetto.com/images/alternatives/typeform.png"}
            alt={"Mailchimp"}
            className={classes.large}
            variant="rounded"
          />
          <div>
            <div className="integration-name mb-2">Typeform</div>
            <div className="integration-short-description">
              Engage your attendees using Q&A, Polls, Quizes using Typeform with
              evenz.
            </div>
          </div>

          <div className="d-flex flex-row align-items-center" style={{ justifySelf: "end" }}>
          <button type="button" className="btn btn-primary btn-outline-text me-3" >Upgrade</button>
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
      <TypeformEnable openDrawer={open} handleCloseDrawer={handleClose} />
    </>
  );
};

export default Typeform;
