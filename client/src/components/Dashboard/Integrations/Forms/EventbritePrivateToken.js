import React from "react";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { IconButton } from "@material-ui/core";
import EventbriteIntegrationPNG from "./../../../../assets/images/int-1.png";

const EventbritePrivateToken = ({ openDrawer, handleCloseDrawer }) => {
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
                src={EventbriteIntegrationPNG}
                alt="integration illustration"
              />
            </div>
            <div>
              <div className="mb-3">
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Eventbrite Private Token
                </label>

                <input
                  type="text"
                  className="me-3 form-control"
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    // handleChangeMailGroupName(e);
                  }}
                  //   value={mailGroupName}
                  id="email-group-name"
                  aria-describedby="emailGroupName"
                  placeholder="Your private token"
                />
              </div>
              <div className="d-flex flex-row align-items-center justify-content-end mb-4">
                <button className="btn btn-outline-primary btn-outline-text">
                  Connect
                </button>
              </div>

              <div>
<div className="want-help-heading mb-3">Want help ?</div>
<div className="integration-guide-btn px-4 py-2">Guid to Integrate Eventbrite with Evenz.</div>

                  </div>


            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default EventbritePrivateToken;
