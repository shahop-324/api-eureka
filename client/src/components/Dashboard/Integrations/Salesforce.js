import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "./Styles/IntegrationCard.scss";
import SalesforceAuth from "./Forms/SalesforceAuth";
import Chip from '@mui/material/Chip';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@mui/material/Button';

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

const Salesforce = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpenSalesforce = () => {
    setOpen(true);
  }

  const handleCloseSalesforce = () => {
    setOpen(false);
  }

  return (
    <>
      <div className="integration-card-container px-4 py-3 mb-4">
        <div
          className=""
          style={{ display: "grid", gridTemplateColumns: "0.7fr 8fr 4fr" }}
        >
          <Avatar
            src={
              "https://logos-world.net/wp-content/uploads/2020/10/Salesforce-Emblem.png"
            }
            alt={"Mailchimp"}
            className={`${classes.large} me-3`}
            variant="rounded"
          />
          <div>
            <div className="integration-name mb-2">Salesforce</div>
            <div className="integration-short-description">
              Manage customer relation with data driven approach by syncing all your evenz data with your salesforce account.
            </div>
          </div>

          <div className="d-flex flex-row align-items-center" style={{ justifySelf: "end" }}>
          <Button style={{fontFamily: "Ubuntu", fontSize: "0.85rem", fontWeight: "500", textTransform: "capitalize"}} className="me-3">Learn more</Button>
          <Chip  label="Premium" color="warning" variant="outlined" style={{fontWeight: "500"}} />
          <button type="button" className="btn btn-primary btn-outline-text ms-3" >Upgrade</button>
          
            <button
              onClick={() => {
                handleOpenSalesforce();
              }}
              className="btn btn-outline-primary btn-outline-text ms-3"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <SalesforceAuth openDrawer={open} handleCloseDrawer={handleCloseSalesforce} />
    </>
  );
};

export default Salesforce;
