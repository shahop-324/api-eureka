/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import "./../Styles/networking.scss";
import { useSelector } from "react-redux";
import socket from "./../service/socket";

import { useParams } from "react-router-dom";
import Matching from "../HelperComponents/Matching";

const Networking = () => {
  const params = useParams();

  const eventId = params.eventId;

  const [open, setOpen] = useState(false);

  const handleCloseMatching = () => {
    setOpen(false);
  };

  const { image, id, firstName, lastName } = useSelector(
    (state) => state.user.userDetails
  );

  useEffect(() => {
    socket.on("listOfAvailablePeopleInNetworking", (list) => {
      console.log(list);
      // dispatch(fetchEventChats(chats));
    });

    socket.emit("joinNetworking", { eventId: eventId, userId: id }, (error) => {
      if (error) {
        alert(error);
      }
    });

    // Emit a signal to join network zone when mounting this component and automatically.
  }, []);

  useEffect(() => {
    return () => {
      
      socket.emit(
        "leaveNetworking",
        { eventId: eventId, userId: id },
        (error) => {
          if (error) {
            alert(error);
          }
        }
      );
    };
  }, []);

  // ! PLACE USER IN AVAILABLE FOR NETWORKING LIST ONLY WHEN HE OR SHE CLICKS ON START SPEED NETWORKING

  return (
    <>
      <div className="sessions-and-networking-body-heading mb-5">
        Start Connecting the dots
      </div>
      {/* <FloatingAvatars /> */}
      <div>
        <div>
          <div class="sonar-wrapper">
            <div class="sonar-emitter" style={{ position: "relative" }}>
              <Avatar
                src={
                  image.startsWith("https")
                    ? image
                    : `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${image}`
                }
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  height: "9rem",
                  width: "9rem",
                  border: "2px solid #538BF7",
                }}
              />
              <div class="sonar-wave"></div>
              <div class="sonar-wave"></div>
              <div class="sonar-wave"></div>
              <div class="sonar-wave"></div>
              <div class="sonar-wave"></div>
              <div class="sonar-wave"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-row justify-content-center networking-options-btn">
        <div
          className="btn-filled-h px-5 py-3 start-networking-btn"
          onClick={() => {
            console.log("speed networking was just clicked!");
            socket.emit("startNetworking", {
              eventId,
              userId: id,
              userName: firstName + " " + lastName,
              image,
              socketId: socket.id,
            });
            setOpen(true);
            // TODO   Emit a message to put this user in available for networking and start matching him/her to others who are also avialable.
          }}
        >
          Start Speed Networking
        </div>
      </div>

      <Matching openMatching={open} handleCloseMatching={handleCloseMatching} />
    </>
  );
};

export default Networking;
