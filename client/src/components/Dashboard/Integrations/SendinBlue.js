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

const SendinBlue = () => {
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
              "https://cdn.ireland.production.livestorm.io/uploads/organization/avatar/0244f4e4-9362-4ce0-9204-f17a81708fcc/2be0c8ff-2d22-4ef8-b567-84b224516b7e.png?v=1569832482"
            }
            alt={"Google Sheets"}
            className={classes.large}
            variant="rounded"
          />
          <div>
            <div className="integration-name mb-2">Sendinblue</div>
            <div className="integration-short-description">
              Sync attendee, leads and interested people to SendinBlue
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

export default SendinBlue;
