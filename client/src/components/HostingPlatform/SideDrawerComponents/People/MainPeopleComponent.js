import React from "react";
import {  IconButton} from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import "./../../Styles/root.scss";
// import AllChatsComponent from "./helper/AllChatsComponent";

import { Dropdown } from "semantic-ui-react";
import PeopleGridAvatar from "./helper/peopleGridAvatar";
import { useSelector } from "react-redux";

const DropdownIcon = () => (
  <Dropdown
    text="Grid"
    icon="grid layout"
    floating
    labeled
    button
    className="icon"
  >
    <Dropdown.Menu>
      <Dropdown.Item icon="list layout" text="List" />
      <Dropdown.Item icon="grid layout" text="Grid" />
    </Dropdown.Menu>
  </Dropdown>
);

const MainPeopleComponent = (props) => {

  const currentlyInEvent = useSelector((state) => state.user.peopleInThisEvent);



  const renderPeopleList = (people) => {
    return people.map((person) => {
      return <PeopleGridAvatar image={ person.userImage.startsWith("https://lh3.googleusercontent.com") ?  person.userImage : `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${person.userImage}`}  name={person.userName} designation={person.userDesignation} organisation={person.userOrganisation} city={person.userCity} country={person.userCountry}   />
    })
  }
  
  return (
    <>
      <div>
        <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between mb-2">
          <div className="event-platform-side-drawer-heading">
            People in event
          </div>

          <div
            onClick={() => {
              props.resetSelectedTab();
              props.setOpenDrawer(false);
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

        <div className="people-container pt-2 px-2">
          <div className="search-box-and-view-switch-container d-flex flex-row justify-content-between mb-3">
            <input
              type="text"
              className="form-control chat-input me-2"
              placeholder="Search people ..."
            />
            <DropdownIcon />
          </div>
          <div className="people-list-grid">
            {renderPeopleList(currentlyInEvent)}
          </div>
          {/* Avatar */}
        </div>
      </div>
    </>
  );
};

export default MainPeopleComponent;
