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

const Intercom = () => {
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
              "https://leadsbridge.com/wp-content/themes/leadsbridge/img/integration-lg-logos/logo75.png"
            }
            alt={"Mailchimp"}
            className={classes.large}
            variant="rounded"
          />

          <div>
            <div className="integration-name mb-2">Intercom</div>
            <div className="integration-short-description">
              Get in touch with your attendees as they visit your event pages and solve their queries to boost registrations.
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

export default Intercom;
