import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "./Styles/IntegrationCard.scss";

import { makeStyles } from "@material-ui/core/styles";
import TwitterAuth from "./Forms/TwitterAuth";

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

const Twitter = () => {


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
              "https://static01.nyt.com/images/2014/08/10/magazine/10wmt/10wmt-superJumbo-v4.jpg"
            }
            alt={"Mailchimp"}
            className={classes.large}
            variant="rounded"
          />
          <div>
            <div className="integration-name mb-2">Twitter</div>
            <div className="integration-short-description">
              Boost engagement in your event with twitter walls.
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

      <TwitterAuth openDrawer={open} handleCloseDrawer={handleClose} />
    </>
  );
};

export default Twitter;
