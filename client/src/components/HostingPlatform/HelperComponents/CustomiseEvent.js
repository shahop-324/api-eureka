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
import { updateEventCustomisation } from "../../../actions";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

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
  const params = useParams();
  const dispatch = useDispatch();

  const eventId = params.eventId;

  const { eventDetails } = useSelector((state) => state.event);

  const [theme, setTheme] = useState(eventDetails.theme);
  const [liveChat, setLiveChat] = useState(eventDetails.liveChat);
  const [privateChat, setPrivateChat] = useState(eventDetails.privateChat);
  const [peopleInEvent, setPeopleInEvent] = useState(
    eventDetails.peopleInEvent
  );

  const [review, setReview] = useState(eventDetails.review);
  const [boothEnabled, setBoothEnabled] = useState(eventDetails.boothEnabled);

  const [loungeEnabled, setLoungeEnabled] = useState(
    eventDetails.loungeEnabled
  );

  const [networkingEnabled, setNetworkingEnabled] = useState(
    eventDetails.networkingEnabled
  );

  // TODO Create form values out of these properties

  let formValues = {
    theme,
    liveChat,
    privateChat,
    peopleInEvent,
    review,
    boothEnabled,
    loungeEnabled,
    networkingEnabled,
  };

  const [openCreateTheme, setOpenCreateTheme] = useState(false);

  const handleOpenTheme = () => {
    setOpenCreateTheme(true);
  };

  const handleCloseTheme = () => {
    setOpenCreateTheme(false);
  };

  const handleChange = (event) => {
    setTheme(event.target.value);

    let newFormValues = { ...formValues };
    newFormValues.theme = event.target.value;
    dispatch(updateEventCustomisation(newFormValues, eventId));
  };

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          onOpen={() => {
            console.log("Side nav was opended");
          }}
          onClose={() => {
            console.log("Side nav was closed");
          }}
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
                  aria-label="theme"
                  name="theme"
                  value={theme}
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
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={liveChat}
                            onChange={(e) => {
                              setLiveChat(e.target.checked);

                              let newFormValues = { ...formValues };
                              newFormValues.liveChat = e.target.checked;
                              dispatch(
                                updateEventCustomisation(newFormValues, eventId)
                              );
                            }}
                            name="liveChat"
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
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={peopleInEvent}
                            onChange={(e) => {
                              setPeopleInEvent(e.target.checked);

                              let newFormValues = { ...formValues };
                              newFormValues.peopleInEvent = e.target.checked;
                              dispatch(
                                updateEventCustomisation(newFormValues, eventId)
                              );
                            }}
                            name="peopleInEvent"
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
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={privateChat}
                            onChange={(e) => {
                              setPrivateChat(e.target.checked);

                              let newFormValues = { ...formValues };
                              newFormValues.privateChat = e.target.checked;
                              dispatch(
                                updateEventCustomisation(newFormValues, eventId)
                              );
                            }}
                            name="privateChat"
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
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={review}
                            onChange={(e) => {
                              setReview(e.target.checked);

                              let newFormValues = { ...formValues };
                              newFormValues.review = e.target.checked;
                              dispatch(
                                updateEventCustomisation(newFormValues, eventId)
                              );
                            }}
                            name="review"
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
                    Networking Area
                  </div>

                  <div>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={networkingEnabled}
                            onChange={(e) => {
                              setNetworkingEnabled(e.target.checked);

                              let newFormValues = { ...formValues };
                              newFormValues.networkingEnabled =
                                e.target.checked;
                              dispatch(
                                updateEventCustomisation(newFormValues, eventId)
                              );
                            }}
                            name="review"
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
                    Lounge Area
                  </div>

                  <div>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={loungeEnabled}
                            onChange={(e) => {
                              setLoungeEnabled(e.target.checked);

                              let newFormValues = { ...formValues };
                              newFormValues.loungeEnabled = e.target.checked;
                              dispatch(
                                updateEventCustomisation(newFormValues, eventId)
                              );
                            }}
                            name="review"
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
                  <div className="hosting-platform-widget-name">Booth Area</div>

                  <div>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <RoyalBlueSwitch
                            checked={boothEnabled}
                            onChange={(e) => {
                              setBoothEnabled(e.target.checked);

                              let newFormValues = { ...formValues };
                              newFormValues.boothEnabled = e.target.checked;
                              dispatch(
                                updateEventCustomisation(newFormValues, eventId)
                              );
                            }}
                            name="review"
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

export default CustomizeEvent;
