/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import { Popup } from "semantic-ui-react";
import socket from "../service/socket";
import { useParams } from "react-router";
import {
  editCurrentlyJoinedChair,
  getRTCTokenForJoiningTable,
} from "../../../actions";

const LeftChair2 = ({ id, launchTableScreen }) => {
  const dispatch = useDispatch();

  const chair = useSelector((state) =>
    state.rooms.chairs.find((chair) => {
      return chair && chair.chairId
        ? chair.chairId === `${id}_chair_9` && chair.status === "Occupied"
          ? chair
          : null
        : null;
    })
  );

  let chairIsOccupied;
  let userName9;
  let userImage9;
  let userCity9;
  let userCountry9;
  let userOrganisation9;
  let userDesignation9;
  let displayPopUp = "auto";
  let displayAvatar = "auto";

  if (chair) {
    // This is the case in which chair is occupied
    chairIsOccupied = true;

    userName9 = chair.userName;
    userImage9 = chair.userImage
      ? chair.userImage.startsWith("https://")
        ? chair.userImage
        : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${chair.userImage}`
      : "";
    userCity9 = chair.userCity;
    userCountry9 = chair.userCountry;
    userOrganisation9 = chair.userOrganisation;
    userDesignation9 = chair.userDesignation;
  } else {
    // What if chair is not occupied
    chairIsOccupied = false;
    displayPopUp = "none";
  }

  const params = useParams();

  const eventId = params.eventId;

  const userDetails = useSelector((state) => state.user.userDetails);

  const { role } = useSelector((state) => state.eventAccessToken);

  const userName = `${userDetails.firstName} ${userDetails.lastName}`;

  const userImage = userDetails.image && userDetails.image;
  const userCity = userDetails.city && userDetails.city;
  const userCountry = userDetails.country && userDetails.country;
  const userOrganisation = userDetails.organisation && userDetails.organisation;
  const userDesignation = userDetails.designation && userDetails.designation;

  const fetchImage = async (imgURL, id) => {
    let response = await fetch(imgURL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let myBlob = await response.blob();

    let objectURL = URL.createObjectURL(myBlob);

    let image = document.createElement("img");
    image.src = objectURL;
    image.style.width = "50px";
    image.style.height = "35px";
    image.style.objectFit = "cover";
    image.style.borderTopLeftRadius = "5px";
    image.style.borderBottomLeftRadius = "5px";
    image.id = `${id}_chair_9_img_blob`;

    if (imgURL) {
      document.getElementById(`${id}_chair_9_img`).appendChild(image);
    } else {
      let element = document.getElementById(`${id}_chair_9_img`);
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  };

  useEffect(() => {
    if (userImage) {
      fetchImage(userImage9, id).catch((e) => {});
    } else {
      if (document.getElementById(`${id}_chair_9_img_blob`)) {
        document.getElementById(`${id}_chair_9_img_blob`).remove();
      }
    }
  }, [userImage9, id]);

  const userId = userDetails._id;

  return (
    <>
      <div
        className="left-chair-wrapper"
        id={`${id}_chair_9`}
        onClick={() => {
          dispatch(editCurrentlyJoinedChair(`${id}_chair_9`));
          socket.emit(
            "updateChair",
            {
              eventId,
              tableId: id,
              chairId: `${id}_chair_9`,
              userId,
              userName,
              userRole: role,
              userEmail: userDetails.email,
              userImage,
              userCity,
              userCountry,
              userOrganisation,
              userDesignation,
              status: "Occupied",
            },
            (error) => {
              if (error) {
                alert(error);
              }
            }
          );
          dispatch(getRTCTokenForJoiningTable(id, userId, launchTableScreen));
        }}
      >
        <div
          className={`left-chair chair pt-2  ${
            chairIsOccupied ? " " : "left-chair-hover"
          } `}
        >
          {/* <PeopleGridAvatar /> */}
          <div style={{ transform: "translate(-8px, -8px)" }}>
            <Popup
              trigger={
                <div
                  id={`${id}_chair_9_img`}
                  style={{
                    position: "relative",
                    top: "0",
                    left: "0",
                    height: "100%",
                    width: "100%",
                    borderRadius: "10px",
                  }}
                ></div>
              }
              position="left center"
            >
              <div style={{ display: displayPopUp }}>
                <div
                  className="d-flex flex-row align-items-center"
                  style={{ display: displayPopUp }}
                >
                  <Avatar
                    alt={userName9}
                    src={userImage9}
                    variant="rounded"
                    style={{ display: displayPopUp }}
                  />
                  <div className="ms-3" style={{ display: displayPopUp }}>
                    <div
                      className="btn-outline-text"
                      style={{ fontSize: "14px", display: displayPopUp }}
                    >
                      {userName9}
                    </div>
                    <div
                      className="people-headline"
                      style={{ display: displayPopUp }}
                    >
                      {userDesignation9} at {userOrganisation9}
                    </div>
                    <div
                      className="people-location"
                      style={{ display: displayPopUp }}
                    >
                      {userCity9}, {userCountry9}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftChair2;
