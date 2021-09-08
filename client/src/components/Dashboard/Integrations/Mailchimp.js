import { Avatar } from "@material-ui/core";
import React from "react";
import "./Styles/IntegrationCard.scss";

import { makeStyles } from "@material-ui/core/styles";

import { useParams } from "react-router";
const { REACT_APP_MY_ENV } = process.env;
const BaseURL = REACT_APP_MY_ENV
  ? "http://localhost:3000/api-eureka/eureka/v1"
  : "https://www.evenz.co.in/api-eureka/eureka/v1";
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

const Mailchimp = () => {
  const params = useParams();
  const classes = useStyles();
  const communityId = params.id;
  return (
    <>
      <div className="integration-card-container px-4 py-3 mb-4">
        <div
          className=""
          style={{ display: "grid", gridTemplateColumns: "0.7fr 8fr 0.7fr" }}
        >
          <Avatar
            src={"https://www.drupal.org/files/project-images/MC_Logo.jpg"}
            alt={"Mailchimp"}
            className={classes.large}
            variant="rounded"
          />

          <div>
            <div className="integration-name mb-2">Mailchimp</div>
            <div className="integration-short-description">
              Sync all of your attendee, leads, interested people and more email
              groups to your mailchimp account.
            </div>
          </div>

          <div style={{ justifySelf: "end" }}>
            <button className="btn btn-outline-primary btn-outline-text">
              <a
                href={`${BaseURL}/auth/mailchimp/?communityId=${communityId}`}
                style={{ textDecoration: "none" }}
              >
                {" "}
                Add
              </a>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mailchimp;
