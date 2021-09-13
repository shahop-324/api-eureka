import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import "./../../Styles/root.scss";
// import AllChatsComponent from "./helper/AllChatsComponent";

import { Dropdown } from "semantic-ui-react";
import PeopleGridAvatar from "./helper/peopleGridAvatar";
import { useSelector } from "react-redux";

import PeopleList from "./helper/PeopleList";

const DropdownIcon = ({ switchView, view }) => (
  <Dropdown
    // text="Grid"
    icon={`${view} layout`}
    // floating
    // labeled
    button
    className="icon"
  >
    <Dropdown.Menu style={{ right: "0", left: "auto" }}>
      <Dropdown.Item
        icon="list layout"
        text="List"
        onClick={() => {
          switchView("list");
        }}
      />
      <Dropdown.Item
        icon="grid layout"
        text="Grid"
        onClick={() => {
          switchView("grid");
        }}
      />
    </Dropdown.Menu>
  </Dropdown>
);

const MainPeopleComponent = (props) => {
  const [view, setView] = useState("grid");

  const switchView = (view) => {
    setView(view);
  };

  const currentlyInEvent = useSelector((state) => state.user.peopleInThisEvent);

  const renderPeopleList = (people) => {
    return people.map((person) => {
      return (
        <PeopleGridAvatar
          image={
            person.userImage.startsWith("https://lh3.googleusercontent.com")
              ? person.userImage
              : `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${person.userImage}`
          }
          name={person.userName}
          designation={person.userDesignation}
          organisation={person.userOrganisation}
          city={person.userCity}
          country={person.userCountry}
        />
      );
    });
  };

  return (
    <>
      <div>
        <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between mb-2">
          <div className="d-flex flex-column mb-3">
            <div className="event-platform-side-drawer-heading">
              People in event
            </div>
            <div className="setting-tab-sub-text">
              Interect with other people in event
            </div>
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
            <div class="ui icon input me-3" style={{ width: "100%" }}>
              <input
                type="text"
                placeholder="Search people..."
                className="form-control"
              />
              <i class="search icon"></i>
            </div>

            <DropdownIcon switchView={switchView} view={view} />
          </div>

          {(() => {
            switch (view) {
              case "grid":
                return (
                  <div className="people-list-grid">
                    {renderPeopleList(currentlyInEvent)}
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
