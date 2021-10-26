import React from "react";
import styled from "styled-components";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { Dialog, IconButton } from "@material-ui/core";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import "./../../index.css";
import StreamSettings from "./SubComponent/StreamSettings";
import SessionCustomisation from "./SubComponent/SessionCustomisation";
import EnableDisableLiveStreaming from "./SubComponent/EnableDisableLiveStreaming";
import { useSelector } from "react-redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function VerticalTabs({ canPublishStream }) {
  let currentUserIsAHost = false;
  let currentUserIsASpeaker = false;
  let currentUserIsAnAttendeeOnStage = false;
  let currentUserIsAnAttendee = false;

  const [value, setValue] = React.useState(0);

  const { userDetails } = useSelector((state) => state.user);
  const { sessionDetails } = useSelector((state) => state.session);

  const userId = userDetails._id;
  const userEmail = userDetails.email;

  const hosts = sessionDetails.host; // Hosts for this session
  const speakers = sessionDetails.speaker; // Speakers for this session

  const hostIds = hosts.map((el) => el._id);
  const speakerEmails = speakers.map((el) => el.email);

  if (hostIds.includes(userId)) {
    //This user is a host
    currentUserIsAHost = true;
  } else if (speakerEmails.includes(userEmail)) {
    // This user is a speaker
    currentUserIsASpeaker = true;
  } else if (
    canPublishStream &&
    !hostIds.includes(userId) &&
    !speakerEmails.includes(userEmail)
  ) {
    // This user is an attendee invited on stage
    currentUserIsAnAttendeeOnStage = true;
  } else {
    currentUserIsAnAttendee = true;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", height: 400 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab
          label="Stream Settings"
          {...a11yProps(0)}
          className="custom-mui-tab"
        />
        {currentUserIsAHost ? (
          <Tab
            label="Customisation"
            {...a11yProps(1)}
            className="custom-mui-tab"
          />
        ) : (
          <></>
        )}

        {currentUserIsAHost ? (
          <Tab
            label="Live streaming"
            {...a11yProps(2)}
            className="custom-mui-tab"
          />
        ) : (
          <></>
        )}
      </Tabs>
      <TabPanel value={value} index={0}>
        <StreamSettings />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SessionCustomisation />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EnableDisableLiveStreaming />
      </TabPanel>
    </Box>
  );
}

const SessionSettingsBody = styled.div`
  height: 558px;
  width: 768px;

  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const WidgetHeadlineWithClose = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  font-size: 1rem;
  font-weight: 500;
  font-family: "Ubuntu";
  color: #152d35;

  border-bottom: 1px solid #152d35;
`;

const SessionSettings = ({ open, handleClose, canPublishStream }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        maxWidth="768px"
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <SessionSettingsBody className="px-4 py-3">
          <WidgetHeadlineWithClose className="pb-1 mb-4">
            <div>Settings</div>
            <div style={{ textAlign: "end" }}>
              <IconButton
                onClick={() => {
                  handleClose();
                }}
              >
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </WidgetHeadlineWithClose>
          <VerticalTabs canPublishStream={canPublishStream} />
        </SessionSettingsBody>
      </Dialog>
    </>
  );
};

export default SessionSettings;
