import React from "react";
import { useSelector } from "react-redux";
import "./../Styles/root.scss";

import RightContent from "./RightContent";
import styled from "styled-components";
import α from "color-alpha";

const MidTopNavBody = styled.div`
  background-color: ${(props) =>
    props && props.color
      ? `${α(props.color, 2)} !important`
      : "#233e44 !important"};
`;

const EventName = styled.div`
  color: #ffffff !important;
  text-transform: capitalize;
  font-weight: 500 !important;
  font-size: 1.05rem !important;
`;

const MidTopNav = ({ eventName }) => {
  const { eventDetails } = useSelector((state) => state.event);

  return (
    <>
      <MidTopNavBody
        color={eventDetails.color}
        className="mid-top-nav ps-3 py-2 d-flex flex-row justify-content-between align-items-center"
      >
        <EventName className="event-name-l2">{eventName}</EventName>
        <div className="d-flex flex-row">
          <RightContent />
        </div>
      </MidTopNavBody>
    </>
  );
};

export default MidTopNav;
