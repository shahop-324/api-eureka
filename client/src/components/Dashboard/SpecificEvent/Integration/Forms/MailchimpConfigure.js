import React from "react";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { IconButton } from "@material-ui/core";
import Select from "react-select";

const audienceList = [];

const styles = {
    control: (base) => ({
      ...base,
      fontFamily: "Inter",
      fontWeight: "600",
      color: "#757575",
    }),
    menu: (base) => ({
      ...base,
      fontFamily: "Inter",
      fontWeight: "600",
      color: "#757575",
    }),
  };

const MailchimpConfigure = ({ openDrawer, handleCloseDrawer }) => {
  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <div className="integration-side-drawer-form px-4 py-4">
            <div className="d-flex flex-row align-items-center justify-content-between">
              <div
                style={{
                  fontWeight: "500",
                  fontFamily: "Ubuntu",
                  color: "#212121",
                  fontSize: "1.2rem",
                }}
              >
                Enable Mailchimp Integration
              </div>
              <IconButton>
                <HighlightOffRoundedIcon
                  onClick={() => {
                    handleCloseDrawer();
                  }}
                />
              </IconButton>
            </div>
            <div style={{ textAlign: "center" }} className="mb-4"></div>
            <div>

            <div class="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Mailchimp audience
              </label>
              <Select
                name="mailchimpList"
                placeholder="Select list"
                styles={styles}
                menuPlacement="bottom"
                options={audienceList}
                // defaultValue={eventOptions[0]}
                // component={renderReactSelect}
              />
            </div>


              <div
                className="d-flex flex-row align-items-center justify-content-end mb-4"
                style={{ width: "100%" }}
              >
                <button
                  className="btn btn-outline-primary btn-outline-text"
                //   style={{ width: "100%" }}
                >
                  Save
                </button>
              </div>
              <div>
                <div className="want-help-heading mb-3">Want help ?</div>
                <div className="integration-guide-btn px-4 py-2">
                  Guid to Integrate Mailchimp with Evenz.
                </div>
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default MailchimpConfigure;
