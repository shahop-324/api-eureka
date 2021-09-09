import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "./../../../Integrations/Styles/IntegrationCard.scss"
import MailchimpConfigure from "../Forms/MailchimpConfigure";

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

const Mailchimp = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseDrawer = () => {
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
            src={"https://www.drupal.org/files/project-images/MC_Logo.jpg"}
            alt={"Mailchimp"}
            className={classes.large}
            variant="rounded"
          />

          <div>
            <div className="integration-name mb-2">Mailchimp</div>
            <div className="integration-short-description">
              It allows to push Bluemeet registrants to your mailchimp account.
            </div>
          </div>

          <div style={{ justifySelf: "end" }}>
            <button
              onClick={() => {
                handleOpen();
              }}
              className="btn btn-outline-primary btn-outline-text"
            >
              Enable
            </button>
          </div>
        </div>
      </div>
      <MailchimpConfigure
        openDrawer={open}
        handleCloseDrawer={handleCloseDrawer}
      />
    </>
  );
};

export default Mailchimp;
