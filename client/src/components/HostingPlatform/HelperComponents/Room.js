import React, { useEffect, useState } from "react";
import "./../Styles/rooms.scss";
import IconButton from "@material-ui/core/IconButton";

import EditRoundedIcon from "@material-ui/icons/EditRounded";
import Amazon from './../../../assets/images/amazon.png';

import socket from "./../service/socket";
import { useDispatch, useSelector } from "react-redux";

import LeftChair from "../chairComponents/LeftChair";
import RightChair from "../chairComponents/RightChair";
import UPPER_1_CHAIR from "../chairComponents/Upper_1_Chair";
import UPPER_2_CHAIR from "../chairComponents/Upper_2_Chair";
import UPPER_3_CHAIR from "../chairComponents/Upper_3_Chair";
import LOWER_5_CHAIR from "../chairComponents/Lower_5_Chair";
import LOWER_6_CHAIR from "../chairComponents/Lower_6_Chair";
import LOWER_7_CHAIR from "../chairComponents/Lower_7_Chair";
import { roomsActions } from "../../../reducers/roomsSlice";

import TableScreen from "../Screens/TableScreen";

const Room = ({ id, num }) => {
  const [openTableScreen, setOpenTableScreen] = useState(false);

  const chairArrangement = useSelector((state) => state.rooms.chairs);

  const launchTableScreen = () => {
    setOpenTableScreen(true);
  };

  const closeTableScreen = () => {
    setOpenTableScreen(false);
  };

  
 

  const dispatch = useDispatch();

  useEffect(() => {

    socket.on("numberOfPeopleOnTable", ({ numberOfPeopleOnTable }) => {
      console.log(numberOfPeopleOnTable);
      dispatch(
        roomsActions.FetchNumOfPeopleOnTable({
          numberOfPeopleOnTable: numberOfPeopleOnTable,
        })
      );
    });



  }, [chairArrangement, dispatch ]);

  return (
    <>
      <div className="room-wrapper px-4 py-3">
        <div className="room-num-and-edit-wrapper d-flex flex-row justify-content-between align-items-center">
          <div className="room-number">{num}</div>
          <IconButton
            aria-label="edit-room-details"
            onClick={() => {
              // TODO Open Table edit form
            }}
          >
            <EditRoundedIcon style={{ fontSize: "20", fill: "#ffffff" }} />
          </IconButton>
        </div>

        <div className="upper-chair-row mt-3">
          {/* // Upper_1_Chair */}
          <div>
            <UPPER_1_CHAIR id={id} launchTableScreen={launchTableScreen} />
          </div>

          {/* // UPPER_2_CHAIR */}
          <div className="mx-3">
            <UPPER_2_CHAIR id={id} launchTableScreen={launchTableScreen} />
          </div>

          {/* // UPPER_3_CHAIR */}
          <div>
            <UPPER_3_CHAIR id={id} launchTableScreen={launchTableScreen} />
          </div>
        </div>

        <div className="mid-l-r-chair-and-table d-flex flex-row">
          <div className="col-3 left-chair-row">
            {/* //Left Chair */}

            <LeftChair id={id} launchTableScreen={launchTableScreen} />
          </div>

          <div className="col-6 room-table px-5 py-4">
            <div className="table-logo-container px-2 py-2">
              <img src={Amazon} alt="logo" style={{maxWidth: "100%", maxHeight: "100%"}}/>
            </div>
          </div>

          <div className="col-3 right-chair-row">
            {/* // Right Chair */}
            <RightChair id={id} launchTableScreen={launchTableScreen} />
          </div>
        </div>

        <div className="lower-chair-row mb-3">
          {/*LOWER_5_CHAIR */}
          <LOWER_5_CHAIR id={id} launchTableScreen={launchTableScreen} />

          {/* // LOWER_6_CHAIR */}
          <div className="mx-3">
            <LOWER_6_CHAIR id={id} launchTableScreen={launchTableScreen} />
          </div>

          {/* // LOWER_7_CHAIR */}
          <LOWER_7_CHAIR id={id} launchTableScreen={launchTableScreen} />
        </div>
      </div>

      {/* Table Screen here */}

      {openTableScreen ? <TableScreen
        openTableScreen={openTableScreen}
        launchTableScreen={launchTableScreen}
        closeTableScreen={closeTableScreen}
        id={id}
      /> : ""}
      
    </>
  );
};

export default Room;
