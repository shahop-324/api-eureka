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

const Marketo = () => {
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
              "https://pbs.twimg.com/profile_images/1387088659950706690/RdUZ2l8-.jpg"
            }
            alt={"Mailchimp"}
            className={classes.large}
            variant="rounded"
          />
          <div>
            <div className="integration-name mb-2">Marketo</div>
            <div className="integration-short-description">
              Boost your event marketing with powerful tools built into marketo by integrating with Evenz.
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

export default Marketo;
