import React, { useEffect } from "react";
import "./../Styles/rooms.scss";

import Room from "./../HelperComponents/Room";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import socket from "../service/socket";

import {
  fetchChairArrangement,
  fetchNumberOfPeopleOnTable,
} from "../../../actions";

const Rooms = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const eventId = params.eventId;

  window.onbeforeunload = () => {
    window.alert("closing now.....");
  };

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
