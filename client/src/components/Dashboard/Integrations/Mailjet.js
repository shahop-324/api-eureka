import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
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

const Mailjet = () => {
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
            src={
              "https://pbs.twimg.com/profile_images/1356623341633875970/tcAYE0Ma_400x400.png"
            }
            alt={"Google Sheets"}
            className={classes.large}
            variant="rounded"
          />
          <div>
            <div className="integration-name mb-2">Mailjet</div>
            <div className="integration-short-description">
              Sync attendee, leads and interested people to mailjet
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

      {/* <FigmaAuth openDrawer={open} handleCloseDrawer={handleClose} /> */}
    </>
  );
};

export default Mailjet;
