import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Avatar } from "@material-ui/core";
import ChatBubbleRoundedIcon from "@material-ui/icons/ChatBubbleRounded";
import Faker from "faker";
import ChatComponent from "./../../LoungeStreaming/ChatComponent";
import { useSelector } from "react-redux";
import styled from "styled-components";

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
  role,
  you,
  handleOpen,
}) => {
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
                {role ? (
                  <UserRoleTag
                    style={{ position: "relative" }}
                    className="px-3 py-1"
                  >
                    {role}
                  </UserRoleTag>
                ) : (
                  <></>
                )}
              </div>

              <div
                style={{
                  fontWeight: "500",
                  color: "#D3D3D3",
                  fontSize: "0.7rem",
                }}
                className="d-flex flex-row align-items-center justify-content-between"
              >
                <div>
                  {designation}, {organisation}
                </div>
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
              width: "48%",
              fontSize: "0.7rem",
            }}
            onClick={() => {
              handleOpen();
            }}
          >
            View profile
          </div>

          <div
            className="view-full-profile-btn py-1"
            style={{
              backgroundColor: "#d3d3d3",
              color: "#152d35",
              width: "48%",
              fontSize: "0.7rem",
            }}
            onClick={() => {
              handleOpen();
            }}
          >
            Message
          </div>
        </div>
      </div>
    </>
  );
};

const renderPeople = (people, userId) => {
  return people.map((person) => {
    // Determine role

    let role = "Host";

    if (person.userRole === "speaker") {
      role = "Speaker";
    }
    if (person.userRole === "host") {
      role = "Host";
    }
    if (person.userRole === "moderator") {
      role = "Moderator";
    }
    if (person.userRole === "exhibitor") {
      role = "Exhibitor";
    }
    if (person.userRole === "attendee") {
      role = null;
    }

    return (
      <PeopleComponent
        key={person.userId}
        you={person.userId === userId ? true : false}
        role={role}
        id={person.userId}
        name={person.userName}
        image={
          person.userImage.startsWith("https://")
            ? person.userImage
            : `https://bluemeet.s3.us-west-1.amazonaws.com/${person.userImage}`
        }
        organisation={person.userOrganisation}
        designation={person.userDesignation}
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

export default function SideComponent({ peopleInThisRoom, tableId }) {
  const { id, role } = useSelector((state) => state.eventAccessToken);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="table-side-drawer">
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
            <ChatComponent tableId={tableId} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div>{renderPeople(peopleInThisRoom, id, role)}</div>
          </TabPanel>
        </Box>
      </div>
    </>
  );
}