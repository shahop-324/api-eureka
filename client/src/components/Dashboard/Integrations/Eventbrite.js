import { Avatar } from "@material-ui/core";
import React from "react";
import "./Styles/IntegrationCard.scss";

import { makeStyles } from "@material-ui/core/styles";

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

const Eventbrite = () => {
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
              "https://img.apksum.com/a4/com.eventbrite.attendee/8.0.2/icon.png"
            }
            alt={"Eventbrite"}
            className={classes.large}
            variant="rounded"
          />

          <div>
            <div className="integration-name mb-2">Eventbrite</div>
            <div className="integration-short-description">
              Easily sync all of your eventbrite registrations to evenz and
              automate mailing link to participants for joining event.
            </div>
          </div>

          <div style={{ justifySelf: "end" }}>
            <button className="btn btn-outline-primary btn-outline-text">
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Eventbrite;
