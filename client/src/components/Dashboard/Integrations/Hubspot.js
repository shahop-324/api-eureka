//

import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "./Styles/IntegrationCard.scss";
import Chip from '@mui/material/Chip';
import { makeStyles } from "@material-ui/core/styles";
import HubspotAuth from "./Forms/HubspotAuth";
import Button from '@mui/material/Button';

import { Link, useParams } from "react-router-dom";
import {navigationIndexForCommunityDash} from "./../../../actions";
import { useDispatch } from "react-redux";


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

const Hubspot = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const params = useParams();

  const userId = params.userId;
  const communityId = params.id;

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
          style={{ display: "grid", gridTemplateColumns: "0.7fr 8fr 4fr" }}
        >
          <Avatar
            src={
              "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_approved-sprocket-2.svg"
            }
            alt={"Mailchimp"}
            className={`${classes.large} me-3`}
            variant="rounded"
          />

          <div>
            <div className="integration-name mb-2">Hubspot</div>
            <div className="integration-short-description">
              Sync your leads and registered users data to hubspot to level up
              your marketing.
            </div>
          </div>

          <div className="d-flex flex-row align-items-center" style={{ justifySelf: "end" }}>
          <Button style={{fontFamily: "Ubuntu", fontSize: "0.85rem", fontWeight: "500", textTransform: "capitalize"}} className="me-3">Learn more</Button>
          <Chip  label="Premium" color="warning" variant="outlined" style={{fontWeight: "500"}} />
          
          <Link to={`/user/${userId}/community/billing/${communityId}`}
                        onClick={() => {
                          dispatch(navigationIndexForCommunityDash(7));
                        }} type="button" className="btn btn-primary btn-outline-text ms-3" >Upgrade</Link>
          
            <button
              onClick={() => {
                handleOpen();
              }}
              className="btn btn-outline-primary btn-outline-text ms-3"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <HubspotAuth openDrawer={open} handleCloseDrawer={handleClose} />
    </>
  );
};

export default Hubspot;
