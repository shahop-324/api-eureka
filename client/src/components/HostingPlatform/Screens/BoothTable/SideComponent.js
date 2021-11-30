import React, { useEffect } from "react";
import styled from "styled-components";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Avatar } from "@material-ui/core";
import ChatComponent from "./ChatComponent";

// ? Missing ChatComponent & PersonProfile

import { useDispatch, useSelector } from "react-redux";

import {
  setVenueRightDrawerSelectedTab,
  setOpenVenueRightDrawer,
  setChatSelectedTab,
  setPersonalChatConfig,
  fetchPeopleOnBoothTable,
} from "./../../../../actions";
import PersonProfile from "../../PersonProfile";

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

const PeopleComponent = ({
  name,
  image,
  organisation,
  designation,
  id,
  you,
  handleOpen,
  person,
}) => {
  const [openProfile, setOpenProfile] = React.useState(false);

  const dispatch = useDispatch();

  let currentUserId = useSelector((state) => state.eventAccessToken.id);

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  return (
    <>
      <div className="people-list-view-card p-3 mb-4">
        <div className="mb-4">
          <div
            className=" mb-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 6fr" }}
          >
            <Avatar src={image} alt={name} variant="rounded" />
            <div
              className="chat-box-name ms-3"
              style={{ textTransform: "capitalize", fontFamily: "Ubuntu" }}
            >
              <div
                className="d-flex flex-row align-items-center justify-content-between"
                style={{
                  color: "#D3D3D3",
                }}
              >
                <span>{`${name} ${you ? "(You)" : ""}`}</span>
              </div>

              <div
                style={{
                  fontWeight: "500",
                  color: "#D3D3D3",
                  fontSize: "0.7rem",
                }}
                className="d-flex flex-row align-items-center justify-content-between"
              >
                {designation && organisation ?   <div>
                  {designation}, {organisation}
                </div> : <></>  }
               
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div
            className="view-full-profile-btn py-1"
            style={{
              backgroundColor: "#d3d3d3",
              color: "#152d35",
              width: "100%",
              fontSize: "0.7rem",
            }}
            onClick={() => {
              setOpenProfile(true);
            }}
          >
            View profile
          </div>
        </div>
      </div>
      <PersonProfile
        open={openProfile}
        userId={id}
        handleClose={handleCloseProfile}
        userImage={image}
        userName={name}
        userOrganisation={organisation}
        userDesignation={designation}
        person={person}
      />
    </>
  );
};

const renderPeople = (people, userId) => {
  return people.map((person) => {
    // Determine role

    let role = "Host";

    return (
      <PeopleComponent
        key={person._id}
        you={person._id === userId ? true : false}
        id={person._id}
        name={`${person.firstName} ${person.lastName}`}
        image={
          person.image
            ? person.image.startsWith("https://")
              ? person.image
              : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${person.image}`
            : ""
        }
        organisation={person.organisation}
        designation={person.designation}
        person={person}
      />
    );
  });
};

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

const SideComponent = ({ tableId, peopleInThisRoom }) => {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.eventAccessToken);
  const userDetails = useSelector((state) => state.user);
  const userId = userDetails._id;
  const [value, setValue] = React.useState(0);

  const { eventDetails } = useSelector((state) => state.event);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(fetchPeopleOnBoothTable(tableId));
  }, []);

  return (
    <>
      <div className="table-side-drawer" style={{ minHeight: "75vh" }}>
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
                maxHeight: "75vh !important",
                height: "75vh",
                overflow: "auto",
              }}
            >
              <ChatComponent tableId={tableId} />
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div
              style={{
                maxHeight: "75vh !important",
                height: "75vh",
                overflow: "auto",
              }}
            >
              {renderPeople(peopleInThisRoom, userId)}
            </div>
          </TabPanel>
        </Box>
      </div>
    </>
  );
};

export default SideComponent;
