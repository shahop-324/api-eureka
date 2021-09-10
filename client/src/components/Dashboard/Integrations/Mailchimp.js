import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "./Styles/IntegrationCard.scss";
import MailchimpConnect from "./Forms/Mailchimp";

import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";

import { mailChimpIntegratedCommunity } from "../../../actions";

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
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  // const urlSearchParams = new URLSearchParams(window.location.search);

  // const query = Object.fromEntries(urlSearchParams.entries());
  // useEffect(() => {
  //   if (query.code) {
  //     console.log(query.code, "I am counting on you query.code");
  //   }
  // }, []);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const params = useParams();
  const classes = useStyles();
  const communityId = params.id;
  const userId = params.userId;
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
            <button
              onClick={() => {
                handleOpen();
                dispatch(mailChimpIntegratedCommunity(communityId));
              }}
              className="btn btn-outline-primary btn-outline-text"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <MailchimpConnect
        communityId={communityId}
        userId={userId}
        openDrawer={open}
        handleCloseDrawer={handleCloseDrawer}
      />
    </>
  );
};

export default Mailchimp;
