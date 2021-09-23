import React, { useState } from "react";
import "./../Styles/Settings.scss";

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { IconButton, Divider } from "@material-ui/core";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import CreateTheme from "./CreateTheme";

import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";

const RoyalBlueRadio = withStyles({
  root: {
    color: "#538BF7",
    "&$checked": {
      color: "#3274F6",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

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

const CustomizeEvent = ({ openDrawer, handleCloseDrawer }) => {
  const [openCreateTheme, setOpenCreateTheme] = useState(false);

  const [checked, setChecked] = React.useState(false);

  const handleChangeToggle = () => {
    setChecked(!checked);
  };

  const handleOpenTheme = () => {
    setOpenCreateTheme(true);
  };

  const handleCloseTheme = () => {
    setOpenCreateTheme(false);
  };

  const [value, setValue] = React.useState("dark");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <div className="hosting-platform-settings px-4 py-4">
            <div className="d-flex flex-row align-items-center justify-content-between">
              <IconButton
                onClick={() => {
                  handleCloseDrawer();
                }}
              >
                <ArrowBackIosRoundedIcon className="icon-btn" />
              </IconButton>
              <div className="event-platform-side-drawer-heading">
                Customise Event
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
              <div className="d-flex flex-column mb-4">
                <div className="event-platform-side-drawer-heading ">
                  Event theme
                </div>
                <div className="setting-tab-sub-text">
                  Here you can set theme for your event.
                </div>
              </div>
              <div
                className="theme-selector  mb-3 d-flex flex-row align-items-center"
                style={{ width: "360px" }}
              >
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  value={value}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                >
                  <div className="theme-option px-3 py-3 mb-3">
                    <FormControlLabel
                      value="dark"
                      control={<RoyalBlueRadio />}
                      label="Dark theme"
                    />
                  </div>
                  <div className="theme-option px-3 py-3 mb-3">
                    <FormControlLabel
                      value="light"
                      control={<RoyalBlueRadio />}
                      label="Light theme"
                    />
                  </div>
                </RadioGroup>
              </div>
              <button
                onClick={() => {
                  handleOpenTheme();
                }}
                className="btn btn-outline-primary btn-outline-text"
                style={{ width: "100%" }}
              >
                Customise theme
              </button>

              <div className="my-4">
                <Divider />
              </div>

              <div>
                <div className="d-flex flex-column mb-4">
                  <div className="event-platform-side-drawer-heading">
                    Manage Widgets
                  </div>
                  <div className="setting-tab-sub-text">
                    Here you can hide areas that you don't want in your event.
                  </div>
                </div>

                <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
                  <div className="hosting-platform-widget-name">Live chat</div>

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
                    People in event
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
                    Private Meetings
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
                    Private chat
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
                  <div className="hosting-platform-widget-name">Q & A</div>

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
                    Attendee count
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
                    Emoji reactions on stage
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
                    Bluemeet Feedback Rating
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
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>

      <CreateTheme open={openCreateTheme} handleClose={handleCloseTheme} />
    </>
  );
};

export default CustomizeEvent;
