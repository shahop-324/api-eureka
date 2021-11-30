import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import { Avatar } from "@material-ui/core";
import ChatBubbleRoundedIcon from "@material-ui/icons/ChatBubbleRounded";
import "./../../../Styles/PeopleList.scss";
import PeopleProfile from "./PeopleProfile";
import { useDispatch, useSelector } from "react-redux";
import {
  setVenueRightDrawerSelectedTab,
  setOpenVenueRightDrawer,
  setChatSelectedTab,
  setPersonalChatConfig,
} from "./../../../../../actions";

import {
  PersonName,
  PeopleListWidget,
  ViewCompleteProfileBtn,
} from "./../../../../SessionStage/Elements";

import PersonProfile from "./../../../PersonProfile";

const PeopleListComponent = ({ person }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { eventDetails } = useSelector((state) => state.event);

  return (
    <>
      <>
        <PeopleListWidget className="mb-3">
          <div className="d-flex flex-row mb-4 justify-content-between">
            <div className="d-flex flex-row">
              <Avatar
                src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${person.image}`}
                alt={person.firstName}
                variant="rounded"
                className="me-3"
              />
              <div>
                <PersonName>
                  {`${person.firstName} ${person.lastName}`}
                </PersonName>
                {person.designation && person.organisation ? (
                  <PersonName>
                    {`${person.designation}, ${person.organisation}`}
                  </PersonName>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {/* <UserRoleTag>Host</UserRoleTag> */}
          </div>
          <ViewCompleteProfileBtn
            color={eventDetails.color}
            onClick={() => {
              setOpen(true);
            }}
          >
            View profile
          </ViewCompleteProfileBtn>
        </PeopleListWidget>
        <PersonProfile
          // hideBtns={true}
          open={open}
          userId={person._id}
          handleClose={handleClose}
          person={person}
        />
      </>
    </>
  );
};

const renderPeopleList = (people) => {
  return people.map((person) => {
    return <PeopleListComponent person={person} />;
  });
};

const PeopleList = () => {
  const [open, setOpen] = useState(false);

  const { eventDetails } = useSelector((state) => state.event);

  let people = [];

  if (eventDetails) {
    people = eventDetails.people;
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>{renderPeopleList(people)}</div>
    </>
  );
};

export default PeopleList;
