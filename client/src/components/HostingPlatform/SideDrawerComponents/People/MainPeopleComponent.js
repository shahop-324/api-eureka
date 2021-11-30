import React, { useState } from "react";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import "./../../Styles/root.scss";
// import AllChatsComponent from "./helper/AllChatsComponent";

import { Dropdown } from "semantic-ui-react";
import { useSelector } from "react-redux";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";

import PeopleList from "./helper/PeopleList";
import PersonProfile from "./../../../HostingPlatform/PersonProfile";

import { makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";

import Popover from "@mui/material/Popover";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import { PersonName } from "./../../../SessionStage/Elements";
import { Avatar } from "@material-ui/core";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import {
  setVenueRightDrawerSelectedTab,
  setChatSelectedTab,
  setPersonalChatConfig,
  setOpenVenueRightDrawer,
} from "./../../../../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const DropdownIcon = ({ switchView, view }) => (
  <Dropdown
    icon={
      view === "list" ? (
        <FormatListBulletedRoundedIcon style={{ fontSize: "18px" }} />
      ) : (
        <GridViewRoundedIcon style={{ fontSize: "18px" }} />
      )
    }
    button
    className="icon"
  >
    <Dropdown.Menu style={{ right: "0", left: "auto" }}>
      <Dropdown.Item
        icon={
          <FormatListBulletedRoundedIcon
            style={{ fontSize: "18px" }}
            className="me-2"
          />
        }
        text="List"
        onClick={() => {
          switchView("list");
        }}
      />
      <Dropdown.Item
        icon={
          <GridViewRoundedIcon style={{ fontSize: "18px" }} className="me-2" />
        }
        text="Grid"
        onClick={() => {
          switchView("grid");
        }}
      />
    </Dropdown.Menu>
  </Dropdown>
);

const PopOverBox = styled.div`
  height: auto;
  width: 280px;
  border-radius: 15px;
  background-color: #ffffff;
`;

const ChatPopup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
  height: 56px;
  width: 56px;
  background-color: #ffffff;
  z-index: 10000;

  &:hover {
    cursor: pointer;
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const PeopleGridComponent = ({ person }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  let isMe = false;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [openProfile, setOpenProfile] = useState(false);

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const { userDetails } = useSelector((state) => state.user);

  const userId = userDetails._id;

  if (person._id.toString() === userId.toString()) {
    isMe = true;
  }

  return (
    <>
      <div>
        {open &&
          (isMe ? (
            <ChatPopup
              onClick={() => {
                setOpenProfile(true);
              }}
              aria-owns={open ? "mouse-over-popover" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <PersonRoundedIcon />
            </ChatPopup>
          ) : (
            <ChatPopup
              onClick={() => {
                dispatch(setVenueRightDrawerSelectedTab("feed"));
                dispatch(setChatSelectedTab("private"));
                dispatch(setPersonalChatConfig(person._id));
                dispatch(setOpenVenueRightDrawer(true));
              }}
              aria-owns={open ? "mouse-over-popover" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <ChatRoundedIcon />
            </ChatPopup>
          ))}

        <Avatar
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${person.image}`}
          alt={`${person.firstName} ${person.lastName}`}
          variant="rounded"
          className={classes.large}
        />
      </div>

      {/*  */}
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <PopOverBox className="px-3 py-2">
          <div className="d-flex flex-row align-items-top mb-3">
            <Avatar
              className={classes.medium}
              variant="rounded"
              src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${person.image}`}
            />
            <div className="ms-3">
              <PersonName className="mb-2">{`${person.firstName} ${person.lastName}`}</PersonName>
              {person.designation && person.organisation ? (
                <PersonName
                  style={{ color: "#6D6D6D" }}
                >{`${person.designation} ${person.organisation}`}</PersonName>
              ) : (
                <></>
              )}
            </div>
          </div>
        </PopOverBox>
      </Popover>
      <PersonProfile
        open={openProfile}
        userId={person._id}
        handleClose={handleCloseProfile}
        person={person}
      />
    </>
  );
};

const renderPeopleGrid = (people, classes) => {
  return people.map((person) => {
    return <PeopleGridComponent person={person} />;
  });
};

const MainPeopleComponent = (props) => {
  const [view, setView] = useState("grid");

  const switchView = (view) => {
    setView(view);
  };

  const { eventDetails } = useSelector((state) => state.event);

  let people = [];

  if (eventDetails) {
    people = eventDetails.people;
  }

  return (
    <>
      <div>
        <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between mb-2">
          <div className="d-flex flex-column mb-3">
            <div className="event-platform-side-drawer-heading">
              People in event ({people.length})
            </div>
            <div className="setting-tab-sub-text">
              Interect with other people in event
            </div>
          </div>

          <div
            onClick={() => {
              props.resetSelectedTab();
              props.openAndCloseDrawer(false);
            }}
          >
            <IconButton aria-label="close-drawer">
              <CancelOutlinedIcon
                style={{ fontSize: "18", color: "#4D4D4D" }}
              />
            </IconButton>
          </div>
        </div>

        {/* here comes people component */}

        <div
          className="people-container pt-2 px-2"
          style={{ height: "auto", minHeight: "75vh" }}
        >
          <div className="search-box-and-view-switch-container d-flex flex-row justify-content-between mb-3">
            <div className="ui icon input me-3" style={{ width: "100%" }}>
              <input
                type="text"
                placeholder="Search people..."
                className="form-control"
              />
              <SearchRoundedIcon
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "10px",
                  color: "#757575",
                }}
              />
            </div>

            <DropdownIcon switchView={switchView} view={view} />
          </div>

          {(() => {
            switch (view) {
              case "grid":
                return (
                  <div className="people-list-grid">
                    {renderPeopleGrid(people)}
                  </div>
                );
              case "list":
                return <PeopleList />;

              default:
                return <div>You are viewing people in this event.</div>;
            }
          })()}

          {/* Avatar */}
        </div>
      </div>
    </>
  );
};

export default MainPeopleComponent;
