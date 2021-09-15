import React from "react";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { IconButton } from "@material-ui/core";
import HubspotIntegrationPNG from "./../../../../assets/images/int-4.png";
const { REACT_APP_MY_ENV } = process.env;
const BaseURL = REACT_APP_MY_ENV
  ? "http://localhost:3000/api-eureka/eureka/v1"
  : "https://www.evenz.co.in/api-eureka/eureka/v1";
const HubspotAuth = ({ openDrawer, handleCloseDrawer }) => {
  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <div className="integration-side-drawer-form px-4 py-4">
            <div>
              <IconButton>
                <HighlightOffRoundedIcon
                  onClick={() => {
                    handleCloseDrawer();
                  }}
                />
              </IconButton>
            </div>
            <div style={{ textAlign: "center" }} className="mb-4">
              <img
                style={{ maxHeight: "420px" }}
                src={HubspotIntegrationPNG}
                alt="integration illustration"
              />
            </div>
            <div>
<<<<<<< HEAD
              <div className="d-flex flex-row align-items-center justify-content-end mb-4">
                <a
                  href={`${BaseURL}/auth/hubspot`}
                  style={{ textDecoration: "none", width: "100%" }}
=======
              <div className="mb-3">
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
>>>>>>> dcc19c1f52445fd45f170568272eff3bb9c71e4c
                >
                  Hubspot Api key
                </label>

                <input
                  type="text"
                  className="me-3 form-control"
                  style={{ width: "100%" }}
                  onChange={(e) => {}}
                  id="hubspot-api-key"
                  aria-describedby="emailGroupName"
                  placeholder="Hubspot API Key"
                />
              </div>
              <div className="d-flex flex-row align-items-center justify-content-end mb-4">
                <button className="btn btn-outline-primary btn-outline-text">
                  Connect
                </button>
              </div>

              <div>
                <div className="want-help-heading mb-3">Want help ?</div>
                <div className="integration-guide-btn px-4 py-2">
                  Guid to Integrate Hubspot with Evenz.
                </div>
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default HubspotAuth;
