import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "./../../../Integrations/Styles/IntegrationCard.scss";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import { makeStyles } from "@material-ui/core/styles";

import { withStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";

import { useParams } from "react-router-dom";
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

const RoyalBlueSwitch = withStyles({
  switchBase: {
    color: "#538BF7",
    "&$checked": {
      color: "#3474F3",
    },
    "&$checked + $track": {
      backgroundColor: "#145DF0",
    },
  },
  checked: {},
  track: {},
})(Switch);

const Tawk = () => {
  const params = useParams();
  const eventId = params.eventId;
  const [open, setOpen] = useState(false);

  const [checked, setChecked] = React.useState(false);
  const dispatch = useDispatch();
  const handleChange = () => {
    if (!checked) {
    //   dispatch(fetchMailChimpAudiences(eventId));

    //   setOpen(true);
    }

    setChecked(!checked);
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
          style={{
            display: "grid",
            gridTemplateColumns: "0.7fr 8fr 3.5fr",
            gridGap: "24px",
          }}
        >
          <Avatar
            src={"https://www.tawk.to/wp-content/uploads/2020/04/tawk-sitelogo.png"}
            alt={"Mailchimp"}
            className={classes.large}
            variant="rounded"
          />

          <div>
            <div className="integration-name mb-2">Tawk</div>
            <div className="integration-short-description">
              Enable tawk to connect with your audience on event landing page and event virtual venue
            </div>
          </div>

          <div
            className="d-flex flex-row align-items-center"
            style={{ justifySelf: "end" }}
          >
            <React.Fragment>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <RoyalBlueSwitch
                      checked={checked}
                      onChange={handleChange}
                      name="mailchimpSwitch"
                    />
                  }
                />
              </FormGroup>
              <div
                style={{
                  color: "#212121",
                  fontFamily: "Ubuntu",
                  fontWeight: "500",
                }}
              >
                {checked ? "Disable" : "Enable"}
              </div>
            </React.Fragment>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Tawk;
