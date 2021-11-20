/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editCurrentlyJoinedChair,
  getRTCTokenForJoiningBoothTable,
} from "./../../../../../actions";
import { Avatar } from "@material-ui/core";
import { Popup } from "semantic-ui-react";
import socket from "../../../service/socket";
import { useParams } from "react-router";

const Chair_4 = ({ id, launchTableScreen }) => {
  const dispatch = useDispatch();

  const chair = useSelector((state) =>
    state.rooms.chairs.find((chair) => {
      return chair && chair.chairId
        ? chair.chairId === `${id}_chair_4` && chair.status === "Occupied"
          ? chair
          : null
        : null;
    })
  );

  let chairIsOccupied;
  let userName4;
  let userImage4;
  let userCity4;
  let userCountry4;
  let userOrganisation4;
  let userDesignation4;
  let displayPopUp = "auto";
  let displayAvatar = "auto";

  if (chair) {
    // This is the case in which chair is occupied
    chairIsOccupied = true;
    userName4 = chair.userName;
    userImage4 = chair.userImage.startsWith("https://")
      ? chair.userImage
      : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${chair.userImage}`;
    userCity4 = chair.userCity;
    userCountry4 = chair.userCountry;
    userOrganisation4 = chair.userOrganisation;
    userDesignation4 = chair.userDesignation;
  } else {
    // What if chair_1 is not occupied
    chairIsOccupied = false;
    displayPopUp = "none";
  }

  const params = useParams();

  const eventId = params.eventId;
  const { currentBoothId } = useSelector((state) => state.booth);

  const { userDetails } = useSelector((state) => state.user);

  const { email, role } = useSelector((state) => state.eventAccessToken);

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
    image.style.width = "40px";
    image.style.height = "35px";
    image.style.objectFit = "cover";
    image.style.borderRadius = "5px";
    image.id = `${id}_chair_4_img_blob`;

    if (imgURL) {
      document.getElementById(`${id}_chair_4_img`).appendChild(image);
    } else {
      let element = document.getElementById(`${id}_chair_4_img`);
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  };

  useEffect(() => {
    if (userImage4) {
      fetchImage(userImage4, id).catch((error) => {
        console.log(error);
      });
    } else {
      if(document.getElementById(`${id}_chair_4_img_blob`)) {
        document.getElementById(`${id}_chair_4_img_blob`).remove();
      }
     
    }
  }, [userImage4, id]);

  const userId = userDetails._id;

  return (
    <>
      <div
        className="right-chair-wrapper"
        id={`${id}_chair_4`}
        onClick={() => {
          dispatch(editCurrentlyJoinedChair(`${id}_chair_4`));

          socket.emit(
            "updateBoothChair",
            {
              eventId,
              boothId: currentBoothId,
              tableId: id,
              chairId: `${id}_chair_4`,
              userName,
              userId,
              userRole: role,
              userEmail: email,
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

          dispatch(
            getRTCTokenForJoiningBoothTable(id, userId, launchTableScreen)
          );
        }}
      >
        <div
          className={`right-chair chair pt-2 ${
            chairIsOccupied ? " " : "right-chair-hover"
          }`}
        >
          {/* <PeopleGridAvatar /> */}

          <div style={{ transform: "translateY(-16.5px)" }}>
            <Popup
              trigger={
                <div
                  id={`${id}_chair_4_img`}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "10px",
                  }}
                ></div>
              }
              position="top center"
            >
              <div style={{ display: displayPopUp }}>
                <div
                  className="d-flex flex-row align-items-center"
                  style={{ display: displayPopUp }}
                >
                  <Avatar
                    alt={userName4}
                    src={userImage4}
                    variant="rounded"
                    style={{ display: displayPopUp }}
                  />
                  <div className="ms-3" style={{ display: displayPopUp }}>
                    <div
                      className="btn-outline-text"
                      style={{ fontSize: "14px", display: displayPopUp }}
                    >
                      {userName4}
                    </div>
                    <div
                      className="people-headline"
                      style={{ display: displayPopUp }}
                    >
                      {userDesignation4} at {userOrganisation4}
                    </div>
                    <div
                      className="people-location"
                      style={{ display: displayPopUp }}
                    >
                      {userCity4}, {userCountry4}
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

export default Chair_4;
