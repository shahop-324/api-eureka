import React, { useEffect, useState } from "react";
import "./../Styles/rooms.scss";

import Room from "./../HelperComponents/Room";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import socket from "../service/socket";

import {
  fetchChairArrangement,
  fetchNumberOfPeopleOnTable,
} from "../../../actions";

import styled from "styled-components";

const CustomHorizontalTabWarpper = styled.div`
  min-width: 500px;
  height: auto;
  border-radius: 10px;
  background-color: #345b63;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 16px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

const CustomTabButton = styled.div`
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  color: #fff;
  align-self: center;

  text-align: center;
  padding: 6px 12px;
  background-color: ${(props) =>
    props.active && props.active ? "#152d35" : "#345b63"};
  border-radius: 10px;
  border: 1px solid transparent;

  &:hover {
    /* border: 1px solid #fff; */
    background-color: #a0a0a057;
    cursor: pointer;
  }
`;

const Rooms = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const eventId = params.eventId;

  window.onbeforeunload = () => {
    window.alert("closing now.....");
  };

  const [selectedTab, setSelectedTab] = useState("videorooms");

  useEffect(() => {
    socket.on("roomChairData", ({ roomChairs }) => {
      console.log(roomChairs);
      dispatch(fetchChairArrangement(roomChairs));
    });

    socket.on("numberOfPeopleOnTable", ({ numberOfPeopleOnTable }) => {
      console.log(numberOfPeopleOnTable);
      dispatch(fetchNumberOfPeopleOnTable(numberOfPeopleOnTable));
    });
  }, [dispatch]);

  const numberOfTables = useSelector(
    (state) =>
      state.event.eventDetails.networkingSettings.socialLounge.numberOfTables
  );

  return (
    <>
     

      <div className="rooms-grid-layout ">
        {/* {tables} */}

        {((numberOfTables, eventId) => {
          let TablesArray = [];

          for (let i = 0; i < numberOfTables; i++) {
            TablesArray.push(<Room id={`${eventId}_table_${i}`} num={i + 1} />);
          }
          return TablesArray;
        })(numberOfTables, eventId)}
      </div>
    </>
  );
};

export default Rooms;
