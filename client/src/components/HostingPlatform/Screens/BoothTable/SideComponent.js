import React from "react";
import styled from "styled-components";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Avatar } from "@material-ui/core";

// ? Missing ChatComponent & PersonProfile

import { useDispatch, useSelector } from "react-redux";

import {
  setVenueRightDrawerSelectedTab,
  setOpenVenueRightDrawer,
  setChatSelectedTab,
  setPersonalChatConfig,
} from "./../../../../actions";

const UserRoleTag = styled.span`
  text-align: center;
  background-color: #147494 !important;
  height: max-content;
  border-radius: 5px;

  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.7rem;
  color: #ffffff;

  padding: 4px 8px;
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

const SideComponent = () => {
  const { id } = useSelector((state) => state.eventAccessToken);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="table-side-drawer" style={{ minHeight: "65vh" }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              centered
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                style={{ color: "#d3d3d3" }}
                label="Feed"
                {...a11yProps(0)}
              />

              <Tab
                style={{ color: "#d3d3d3" }}
                label="People"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div
              style={{
                maxHeight: "65vh !important",
                height: "65vh",
                overflow: "auto",
              }}
            ></div>
            {/* <ChatComponent tableId={tableId} /> */}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div
              style={{
                maxHeight: "65vh !important",
                height: "65vh",
                overflow: "auto",
              }}
            >
              {/* {renderPeople(peopleInThisRoom, id)} */}
            </div>
          </TabPanel>
        </Box>
      </div>
    </>
  );
};

export default SideComponent;
