import React from "react";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { IconButton } from "@material-ui/core";
import TypeformIntegrationPNG from "./../../../../assets/images/int-7.png";
const { REACT_APP_MY_ENV } = process.env;
const BaseURL = REACT_APP_MY_ENV
  ? "http://localhost:3000/api-eureka/eureka/v1"
  : "https://www.evenz.co.in/api-eureka/eureka/v1";
const TypeformEnable = ({ openDrawer, handleCloseDrawer }) => {
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
                src={TypeformIntegrationPNG}
                alt="integration illustration"
              />
            </div>
            <div>
              <div className="d-flex flex-row align-items-center justify-content-end mb-4">
                <a
                  href={`${BaseURL}/auth/mailChimp`}
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <button
                    className="btn btn-outline-primary btn-outline-text"
                    style={{ width: "100%" }}
                  >
                    Authorize using Typeform
                  </button>
                </a>
              </div>
              <div>
                <div className="want-help-heading mb-3">Want help ?</div>
                <div className="integration-guide-btn px-4 py-2">
                  Guide to Integrate Typeform with Evenz.
                </div>
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default TypeformEnable;
