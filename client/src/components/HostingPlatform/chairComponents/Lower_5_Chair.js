/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../reducers/userSlice";
import { Avatar } from "@material-ui/core";

import { Popup } from "semantic-ui-react";
import socket from "../service/socket";
import { useParams } from "react-router";

const LOWER_5_CHAIR = ({ id, launchTableScreen }) => {
  const dispatch = useDispatch();

  const chair = useSelector((state) => state.rooms.chairs.find((chair) => {
    return (chair && chair.chairId ? (chair.chairId === `${id}_chair_5` && chair.status === "Occupied" ? chair  : null) : null);
   }) );

   

   

  let chairIsOccupied;
  let userName5;
  let userImage5;
  let userCity5;
  let userCountry5;
  let userOrganisation5;
  let userDesignation5;
  let displayPopUp = "auto";
  let displayAvatar = "auto";

  if (chair) {
    // What if chair_5 is occupied
    chairIsOccupied = true;

    userName5 = chair.userName;
    userImage5 = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${chair.userImage}`;
    userCity5 = chair.userCity;
    userCountry5 = chair.userCountry;
    userOrganisation5 = chair.userOrganisation;
    userDesignation5 = chair.userDesignation;
    
  }
  else {
    // What if chair_5 is not occupied
    chairIsOccupied = false;

    
    displayPopUp = "none";
    displayAvatar = "none";
  }

  const fetchImage = async(imgURL, id) => {
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
    image.style.borderBottomLeftRadius = "5px";
    image.style.borderBottomRightRadius = "5px";
    image.id = `${id}_chair_5_img_blob`;

    if (imgURL) {
      document.getElementById(`${id}_chair_5_img`).appendChild(image);
    } else {
      let element = document.getElementById(`${id}_chair_5_img`);
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }

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

   


  useEffect(() => {
    if (userImage) {
      fetchImage(userImage5, id).catch((e) => {
        console.log(
          "There has been a problem with your fetch operation: " + e.message
        );
      });
    } else {
      document.getElementById(`${id}_chair_5_img_blob`).remove();
    }
   
  }, [userImage5, id, userImage]);

  



  const params = useParams();
  // console.log(params);

  const eventId = params.eventId;

  

  return (
    <>
      <div
        className="lower-chair-wrapper"
        id={`${id}_chair_5`}
        onClick={() => {
          console.log(`${id}_chair_5`);

          dispatch(
            userActions.EditCurrentlyJoinedChair({
              chairId: `${id}_chair_5`,
            })
          );

          socket.emit(
            "updateChair",
            {
              eventId,
              tableId: id,
              chairId: `${id}_chair_5`,
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

          launchTableScreen();
        }}
      >
            <div className="lower-chair chair pt-2">
              <div style={{ transform: "translateY(0)" }}>
                <Popup
                  trigger={
                    <div
                    id={`${id}_chair_5_img`}
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
                  position="bottom center"
                >
                  <div style={{display: displayPopUp}}>
                    <div className="d-flex flex-row align-items-center" style={{display: displayPopUp}}>
                      <Avatar
                        alt="Remy Sharp"
                        src={userImage5}
                        variant="rounded" style={{display: displayPopUp}}
                      />
                      <div className="ms-3" style={{display: displayPopUp}}>
                        <div
                          className="btn-outline-text"
                          style={{ fontSize: "14px", display: displayPopUp }}
                        >
                          {userName5}
                        </div>
                        <div className="people-headline" style={{display: displayPopUp}}>
                          {userDesignation5} at {userOrganisation5}
                        </div>
                        <div className="people-location" style={{display: displayPopUp}}>{userCity5}, {userCountry5}</div>
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

export default LOWER_5_CHAIR;
