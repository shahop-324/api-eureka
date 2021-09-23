import React, { useState } from "react";
import "./../Styles/Settings.scss";

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { IconButton, Divider } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import CreateTheme from "./CreateTheme";

import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";

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

const NotificationSettings = ({ openDrawer, handleCloseDrawer }) => {
  const [openCreateTheme, setOpenCreateTheme] = useState(false);

  const [checked, setChecked] = React.useState(false);

  const handleChangeToggle = () => {
    setChecked(!checked);
  };



  const handleCloseTheme = () => {
    setOpenCreateTheme(false);
  };



  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <div
            className="hosting-platform-settings px-4 py-4"
            style={{ minWidth: "420px" }}
          >
            <div className="d-flex flex-row align-items-center justify-content-between">
              <div className="event-platform-side-drawer-heading">
                Notification Settings
              </div>

              <IconButton
                onClick={() => {
                  handleCloseDrawer();
                }}
              >
                <CancelRoundedIcon />
              </IconButton>
            </div>

            <div className="my-3">
              <Divider />
            </div>

            <div className="px-3 py-2">
              <div>
                <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
                  <div className="hosting-platform-widget-name">
                    Message notifications
                  </div>

                  <div>
                    {/* <VisibilityOffIcon className="icon-btn" />
                    <div className="show-hide-text">hide</div> */}
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={checked}
                            onChange={handleChangeToggle}
                            name="mailchimpSwitch"
                          />
                        }
                      />
                    </FormGroup>
                  </div>
                </div>
                <div className="my-3">
                  <Divider />
                </div>
                <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
                  <div className="hosting-platform-widget-name">Alerts</div>

                  <div>
                    {/* <VisibilityOffIcon className="icon-btn" />
                    <div className="show-hide-text">hide</div> */}
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={checked}
                            onChange={handleChangeToggle}
                            name="mailchimpSwitch"
                          />
                        }
                      />
                    </FormGroup>
                  </div>
                </div>
                <div className="my-3">
                  <Divider />
                </div>
                <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
                  <div className="hosting-platform-widget-name">
                    Poll notification
                  </div>

                  <div>
                    {/* <VisibilityOffIcon className="icon-btn" />
                    <div className="show-hide-text">hide</div> */}
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={checked}
                            onChange={handleChangeToggle}
                            name="mailchimpSwitch"
                          />
                        }
                      />
                    </FormGroup>
                  </div>
                </div>
                <div className="my-3">
                  <Divider />
                </div>
                <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
                  <div className="hosting-platform-widget-name">
                    Notification sound
                  </div>

                  <div>
                    {/* <VisibilityOffIcon className="icon-btn" />
                    <div className="show-hide-text">hide</div> */}
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={checked}
                            onChange={handleChangeToggle}
                            name="mailchimpSwitch"
                          />
                        }
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>

      <CreateTheme open={openCreateTheme} handleClose={handleCloseTheme} />
    </>
  );
};

export default NotificationSettings;
