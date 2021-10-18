/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../reducers/userSlice";
import { Avatar } from "@material-ui/core";
import { Popup } from "semantic-ui-react";
import socket from "../service/socket";
import { useParams } from "react-router";
import { fetchTwillioVideoRoomToken, getRTCTokenForJoiningTable } from "../../../actions";

const LeftChair = ({ id, launchTableScreen }) => {
  const dispatch = useDispatch();

  const chair = useSelector((state) =>
    state.rooms.chairs.find((chair) => {
      return chair && chair.chairId
        ? chair.chairId === `${id}_chair_8` && chair.status === "Occupied"
          ? chair
          : null
        : null;
    })
  );

  let chairIsOccupied;
  let userName8;
  let userImage8;
  let userCity8;
  let userCountry8;
  let userOrganisation8;
  let userDesignation8;
  let displayPopUp = "auto";
  let displayAvatar = "auto";

  if (chair) {
    // What if chair_1 is occupied
    chairIsOccupied = true;

    userName8 = chair.userName;
    userImage8 = chair.userImage.startsWith("https://")
      ? chair.userImage
      : `https://bluemeet.s3.us-west-1.amazonaws.com/${chair.userImage}`;
    userCity8 = chair.userCity;
    userCountry8 = chair.userCountry;
    userOrganisation8 = chair.userOrganisation;
    userDesignation8 = chair.userDesignation;
  } else {
    // What if chair_1 is not occupied
    chairIsOccupied = false;

    displayPopUp = "none";
    displayAvatar = "none";
  }

  const [preview, setPreview] = useState(userImage8);

  const params = useParams();

  const eventId = params.eventId;

  const userDetails = useSelector((state) => state.user.userDetails);

  const { email } = useSelector((state) => state.eventAccessToken);

  const userName = `${userDetails.firstName} ${userDetails.lastName}`;

  const userImage = userDetails.image ? userDetails.image : " ";
  const userCity = userDetails.city ? userDetails.city : "Los Angeles";
  const userCountry = userDetails.country ? userDetails.country : "USA";
  const userOrganisation = userDetails.organisation
    ? userDetails.organisation
    : "Google Inc.";
  const userDesignation = userDetails.designation
    ? userDetails.designation
    : "Vice President";

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
    image.id = `${id}_chair_8_img_blob`;

    if (imgURL) {
      document.getElementById(`${id}_chair_8_img`).appendChild(image);
    } else {
      let element = document.getElementById(`${id}_chair_8_img`);
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  };

  useEffect(() => {
    if (userImage) {
      fetchImage(userImage8, id).catch((e) => {
        
        //   "There has been a problem with your fetch operation."
        
      });
    } else {
      document.getElementById(`${id}_chair_8_img_blob`).remove();
    }
  }, [userImage8, id, userImage]);

  const userId = useSelector((state) => state.user.userDetails._id);

  return (
    <>
      <div className="reload">
        <div
          className="left-chair-wrapper"
          id={`${id}_chair_8`}
          onClick={() => {
            console.log(`${id}_chair_8`);

            dispatch(
              userActions.EditCurrentlyJoinedChair({
                chairId: `${id}_chair_8`,
              })
            );

            socket.emit(
              "updateChair",
              {
                eventId,
                tableId: id,
                chairId: `${id}_chair_8`,
                userName,
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
            dispatch(getRTCTokenForJoiningTable(id, userId, launchTableScreen));
          }}
        >
          <div className={`left-chair chair pt-2  ${chairIsOccupied ? " " : "left-chair-hover"} `}>
            {/*  */}

            <div style={{ transform: "translate(-8px, -8px)" }}>
              <Popup
                trigger={
                  <div
                    id={`${id}_chair_8_img`}
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
                      alt={userName8}
                      src={preview}
                      variant="rounded"
                      style={{ display: displayPopUp }}
                    />
                    <div className="ms-3" style={{ display: displayPopUp }}>
                      <div
                        className="btn-outline-text"
                        style={{ fontSize: "14px", display: displayPopUp }}
                      >
                        {userName8}
                      </div>
                      <div
                        className="people-headline"
                        style={{ display: displayPopUp }}
                      >
                        {userDesignation8} at {userOrganisation8}
                      </div>
                      <div
                        className="people-location"
                        style={{ display: displayPopUp }}
                      >
                        {userCity8}, {userCountry8}
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftChair;
