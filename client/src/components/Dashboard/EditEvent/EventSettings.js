import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useParams } from "react-router";
import { IconButton, Avatar } from "@material-ui/core";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import socket from "./../../HostingPlatform/service/socket";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/styles";

import {
  editEvent,
  acceptInEvent,
  showSnackbar,
  resetEventLabels,
} from "./../../../actions";

import { Divider } from "@material-ui/core";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StorefrontRoundedIcon from "@material-ui/icons/StorefrontRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import WeekendIcon from "@mui/icons-material/Weekend";
import ConnectWithoutContactRoundedIcon from "@mui/icons-material/ConnectWithoutContactRounded";

import DashboardIcon from "@material-ui/icons/Dashboard";
import SecurityIcon from "@material-ui/icons/Security";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";
import NotificationsRoundedIcon from "@material-ui/icons/NotificationsRounded";
import GroupIcon from "@material-ui/icons/Group";

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const Conatiner = styled.div`
  height: 600px;
  width: 660px;
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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

const EventEntrySettings = () => {
  const dispatch = useDispatch();

  const { eventDetails } = useSelector((state) => state.event);

  const [sessionEntry, setSessionEntry] = useState(
    eventDetails.allowEntryBeforeSessionBegin
  );
  const [networkingEntry, setNetworkingEntry] = useState(
    eventDetails.networkingEntry
  );
  const [loungeEntry, setLoungeEntry] = useState(eventDetails.loungeEntry);
  const [boothEntry, setBoothEntry] = useState(eventDetails.boothEntry);

  const params = useParams();
  const eventId = params.id;

  return (
    <>
      <>
        <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
          <div className="hosting-platform-widget-name">
            Allow attendess to enter session before it begins
          </div>

          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalBlueSwitch
                    checked={sessionEntry}
                    onChange={(e) => {
                      console.log(e.target.checked);
                      setSessionEntry(e.target.checked);

                      dispatch(
                        editEvent(
                          { allowEntryBeforeSessionBegin: e.target.checked },
                          eventId
                        )
                      );
                    }}
                    name="sessionReplay"
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
            Allow attendess to enter Networking before event begins
          </div>

          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalBlueSwitch
                    checked={networkingEntry}
                    onChange={(e) => {
                      console.log(e.target.checked);
                      setNetworkingEntry(e.target.checked);

                      dispatch(
                        editEvent(
                          { networkingEntry: e.target.checked },
                          eventId
                        )
                      );
                    }}
                    name="networkingEntry"
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
            Allow attendess to enter lounge before event begins
          </div>

          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalBlueSwitch
                    checked={loungeEntry}
                    onChange={(e) => {
                      console.log(e.target.checked);
                      setLoungeEntry(e.target.checked);

                      dispatch(
                        editEvent({ loungeEntry: e.target.checked }, eventId)
                      );
                    }}
                    name="loungeEntry"
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
            Allow attendess to enter booth before event begins
          </div>

          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalBlueSwitch
                    checked={boothEntry}
                    onChange={(e) => {
                      console.log(e.target.checked);
                      setBoothEntry(e.target.checked);

                      dispatch(
                        editEvent({ boothEntry: e.target.checked }, eventId)
                      );
                    }}
                    name="boothEntry"
                  />
                }
              />
            </FormGroup>
          </div>
        </div>

        <div className="my-3">
          <Divider />
        </div>
      </>
    </>
  );
};

const EventNavLabels = () => {
  const { eventDetails } = useSelector((state) => state.event);

  const [lobbyLabel, setLobbyLabel] = useState(eventDetails.lobbyLabel);
  const [sessionsLabel, setSessionsLabel] = useState(
    eventDetails.sessionsLabel
  );
  const [networkingLabel, setNetworkingLabel] = useState(
    eventDetails.networkingLabel
  );
  const [loungeLabel, setLoungeLabel] = useState(eventDetails.loungeLabel);
  const [boothLabel, setBoothLabel] = useState(eventDetails.boothLabel);
  const [feedLabel, setFeedLabel] = useState(eventDetails.feedLabel);
  const [peopleLabel, setPeopleLabel] = useState(eventDetails.peopleLabel);
  const [alertsLabel, setAlertsLabel] = useState(eventDetails.alertsLabel);
  const [moderationLabel, setModerationLabel] = useState(
    eventDetails.moderationLabel
  );
  const [settingsLabel, setSettingsLabel] = useState(
    eventDetails.settingsLabel
  );

  const params = useParams();
  const eventId = params.id;
  const dispatch = useDispatch();

  const handleSubmitLabels = () => {
    if (
      !lobbyLabel ||
      !sessionsLabel ||
      !networkingLabel ||
      !loungeLabel ||
      !boothLabel ||
      !feedLabel ||
      !peopleLabel ||
      !alertsLabel ||
      !moderationLabel ||
      !settingsLabel
    ) {
      dispatch(showSnackbar("info", "No label should remain empty"));
      return;
    } else {
      dispatch(
        editEvent(
          {
            lobbyLabel,
            sessionsLabel,
            networkingLabel,
            loungeLabel,
            boothLabel,
            feedLabel,
            peopleLabel,
            alertsLabel,
            moderationLabel,
            settingsLabel,
          },
          eventId
        )
      );
    }
  };

  return (
    <>
      <div className="d-flex flex align-items-center mb-3">
        <div
          className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-4"
          style={{ marginBottom: "0", width: "80px" }}
        >
          <div className={"icon-wrapper p-3 mb-1 " + "active-wrapper-h"}>
            <HomeRoundedIcon className={"icon-btn-h icon-btn-active-h"} />
          </div>
          <div
            className={"icon-btn-text icon-btn-text-active-h"}
            style={{ textAlign: "center" }}
          >
            {lobbyLabel}
          </div>
        </div>
        <input
          className="form-control"
          value={lobbyLabel}
          onChange={(e) => {
            setLobbyLabel(e.target.value);
          }}
        />
      </div>
      <div className="my-3">
        <Divider />
      </div>
      <div className="d-flex flex align-items-center mb-3">
        <div
          className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-4"
          style={{ marginBottom: "0", width: "80px" }}
        >
          <div className={"icon-wrapper p-3 mb-1 " + "active-wrapper-h"}>
            <VideocamRoundedIcon className={"icon-btn-h icon-btn-active-h"} />
          </div>
          <div
            className={"icon-btn-text icon-btn-text-active-h"}
            style={{ textAlign: "center" }}
          >
            {sessionsLabel}
          </div>
        </div>
        <input
          className="form-control"
          value={sessionsLabel}
          onChange={(e) => {
            setSessionsLabel(e.target.value);
          }}
        />
      </div>
      <div className="my-3">
        <Divider />
      </div>
      <div className="d-flex flex align-items-center mb-3">
        <div
          className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-4"
          style={{ marginBottom: "0", width: "80px" }}
        >
          <div className={"icon-wrapper p-3 mb-1 " + "active-wrapper-h"}>
            <ConnectWithoutContactRoundedIcon
              className={"icon-btn-h icon-btn-active-h"}
            />
          </div>
          <div
            className={"icon-btn-text icon-btn-text-active-h"}
            style={{ textAlign: "center" }}
          >
            {networkingLabel}
          </div>
        </div>
        <input
          className="form-control"
          value={networkingLabel}
          onChange={(e) => {
            setNetworkingLabel(e.target.value);
          }}
        />
      </div>
      <div className="my-3">
        <Divider />
      </div>
      <div className="d-flex flex align-items-center mb-3">
        <div
          className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-4"
          style={{ marginBottom: "0", width: "80px" }}
        >
          <div className={"icon-wrapper p-3 mb-1 " + "active-wrapper-h"}>
            <WeekendIcon className={"icon-btn-h icon-btn-active-h"} />
          </div>
          <div
            className={"icon-btn-text icon-btn-text-active-h"}
            style={{ textAlign: "center" }}
          >
            {loungeLabel}
          </div>
        </div>
        <input
          className="form-control"
          value={loungeLabel}
          onChange={(e) => {
            setLoungeLabel(e.target.value);
          }}
        />
      </div>
      <div className="my-3">
        <Divider />
      </div>
      <div className="d-flex flex align-items-center mb-3">
        <div
          className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-4"
          style={{ marginBottom: "0", width: "80px" }}
        >
          <div className={"icon-wrapper p-3 mb-1 " + "active-wrapper-h"}>
            <StorefrontRoundedIcon className={"icon-btn-h icon-btn-active-h"} />
          </div>
          <div
            className={"icon-btn-text icon-btn-text-active-h"}
            style={{ textAlign: "center" }}
          >
            {boothLabel}
          </div>
        </div>
        <input
          className="form-control"
          value={boothLabel}
          onChange={(e) => {
            setBoothLabel(e.target.value);
          }}
        />
      </div>
      <div className="my-3">
        <Divider />
      </div>
      <div className="d-flex flex align-items-center mb-3">
        <div
          className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-4"
          style={{ marginBottom: "0", width: "80px" }}
        >
          <div className={"icon-wrapper p-3 mb-1 " + "active-wrapper-h"}>
            <DashboardIcon className={"icon-btn-h icon-btn-active-h"} />
          </div>
          <div
            className={"icon-btn-text icon-btn-text-active-h"}
            style={{ textAlign: "center" }}
          >
            {feedLabel}
          </div>
        </div>
        <input
          className="form-control"
          value={feedLabel}
          onChange={(e) => {
            setFeedLabel(e.target.value);
          }}
        />
      </div>
      <div className="my-3">
        <Divider />
      </div>
      <div className="d-flex flex align-items-center mb-3">
        <div
          className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-4"
          style={{ marginBottom: "0", width: "80px" }}
        >
          <div className={"icon-wrapper p-3 mb-1 " + "active-wrapper-h"}>
            <GroupIcon className={"icon-btn-h icon-btn-active-h"} />
          </div>
          <div
            className={"icon-btn-text icon-btn-text-active-h"}
            style={{ textAlign: "center" }}
          >
            {peopleLabel}
          </div>
        </div>
        <input
          className="form-control"
          value={peopleLabel}
          onChange={(e) => {
            setPeopleLabel(e.target.value);
          }}
        />
      </div>
      <div className="my-3">
        <Divider />
      </div>
      <div className="d-flex flex align-items-center mb-3">
        <div
          className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-4"
          style={{ marginBottom: "0", width: "80px" }}
        >
          <div className={"icon-wrapper p-3 mb-1 " + "active-wrapper-h"}>
            <NotificationsRoundedIcon
              className={"icon-btn-h icon-btn-active-h"}
            />
          </div>
          <div
            className={"icon-btn-text icon-btn-text-active-h"}
            style={{ textAlign: "center" }}
          >
            {alertsLabel}
          </div>
        </div>
        <input
          className="form-control"
          value={alertsLabel}
          onChange={(e) => {
            setAlertsLabel(e.target.value);
          }}
        />
      </div>
      <div className="my-3">
        <Divider />
      </div>
      <div className="d-flex flex align-items-center mb-3">
        <div
          className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-4"
          style={{ marginBottom: "0", width: "80px" }}
        >
          <div className={"icon-wrapper p-3 mb-1 " + "active-wrapper-h"}>
            <SecurityIcon className={"icon-btn-h icon-btn-active-h"} />
          </div>
          <div
            className={"icon-btn-text icon-btn-text-active-h"}
            style={{ textAlign: "center" }}
          >
            {moderationLabel}
          </div>
        </div>
        <input
          className="form-control"
          value={moderationLabel}
          onChange={(e) => {
            setModerationLabel(e.target.value);
          }}
        />
      </div>
      <div className="my-3">
        <Divider />
      </div>
      <div className="d-flex flex align-items-center mb-3">
        <div
          className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-4"
          style={{ marginBottom: "0", width: "80px" }}
        >
          <div className={"icon-wrapper p-3 mb-1 " + "active-wrapper-h"}>
            <SettingsRoundedIcon className={"icon-btn-h icon-btn-active-h"} />
          </div>
          <div
            className={"icon-btn-text icon-btn-text-active-h"}
            style={{ textAlign: "center" }}
          >
            {settingsLabel}
          </div>
        </div>
        <input
          className="form-control"
          value={settingsLabel}
          onChange={(e) => {
            setSettingsLabel(e.target.value);
          }}
        />
      </div>
      <div className="my-3">
        <Divider />
      </div>

      <div className="d-flex flex-row align-items-center justify-content-end">
        <button
          onClick={() => {
            dispatch(resetEventLabels(eventId));
          }}
          className="btn btn-outline-text btn-outline-dark d-flex flex-row align-items-center me-3"
        >
          <RestartAltIcon style={{ fontSize: "18px" }} className="me-2" />{" "}
          <span>Reset to default</span>
        </button>
        <button
          onClick={() => {
            handleSubmitLabels();
          }}
          className="btn btn-outline-text btn-primary"
        >
          Save
        </button>
      </div>
    </>
  );
};

const BlockedPeopleComponent = ({ person }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const eventId = params.id;
  const { userDetails } = useSelector((state) => state.user);

  return (
    <>
      <div className="d-flex flex-row align-items-center justify-content-between">
        <div className="d-flex flex-row align-items-center">
          <Avatar
            src={
              person.image
                ? person.image.startsWith("https://")
                  ? person.image
                  : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${person.image}`
                : ""
            }
            alt={`${person.firstName} ${person.lastName}`}
            variant="rounded"
          />
          <div className="ms-3 ">
            <div
              style={{
                color: "#212121",
                fontWeight: "500",
                fontSize: "0.8rem",
              }}
              className="mb-2"
            >
              {`${person.firstName} ${person.lastName}`}
            </div>
            <div
              style={{
                color: "#616161",
                fontWeight: "500",
                fontSize: "0.75rem",
              }}
              className=""
            >
              {person.designation} {person.organisation}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            dispatch(acceptInEvent(eventId, person._id));
          }}
          className="btn btn-outline-text btn-outline-danger"
        >
          Lift ban
        </button>
      </div>
    </>
  );
};

const renderBlockedPeople = (people) => {
  return people.map((person) => {
    return <BlockedPeopleComponent person={person} />;
  });
};

const BasicTabs = () => {
  const [value, setValue] = useState(0);

  const { eventDetails } = useSelector((state) => state.event);

  const params = useParams();
  const eventId = params.id;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            style={{ fontWeight: "500", textTransform: "capitalize" }}
            label="Event entry"
            {...a11yProps(0)}
          />
          <Tab
            style={{ fontWeight: "500", textTransform: "capitalize" }}
            label="Nav Labels"
            {...a11yProps(1)}
          />
          <Tab
            style={{ fontWeight: "500", textTransform: "capitalize" }}
            label="Blocked People"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel
        style={{ fontWeight: "500", textTransform: "capitalize" }}
        value={value}
        index={0}
      >
        {/*  */}
        <EventEntrySettings />
      </TabPanel>
      <TabPanel
        style={{ fontWeight: "500", textTransform: "capitalize" }}
        value={value}
        index={1}
      >
        {/*  */}
        <EventNavLabels />
      </TabPanel>
      <TabPanel
        style={{ fontWeight: "500", textTransform: "capitalize" }}
        value={value}
        index={2}
      >
        {renderBlockedPeople(eventDetails.blocked)}
      </TabPanel>
    </Box>
  );
};

const EventSettings = ({ open, handleClose }) => {
  const theme = useTheme();
  const params = useParams();
  const eventId = params.id;
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
        maxWidth={"660px"}
      >
        <>
          <HeaderFooter className="form-heading-and-close-button mb-4 px-4 py-3">
            <div></div>
            <div className="coupon-overlay-form-headline">Event Settings</div>
            <div className="overlay-form-close-button" onClick={handleClose}>
              <IconButton aria-label="delete">
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </HeaderFooter>
          <Conatiner className="px-3">
            <BasicTabs></BasicTabs>
          </Conatiner>
        </>
      </Dialog>
    </>
  );
};

export default EventSettings;
