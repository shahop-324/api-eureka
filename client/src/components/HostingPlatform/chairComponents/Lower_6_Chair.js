/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../reducers/userSlice";
import { Avatar } from "@material-ui/core";

import { Popup } from "semantic-ui-react";
import socket from "../service/socket";
import { useParams } from "react-router";

const LOWER_6_CHAIR = ({ id, launchTableScreen }) => {
  const dispatch = useDispatch();

  const chair = useSelector((state) => state.rooms.chairs.find((chair) => {
    return (chair && chair.chairId ? (chair.chairId === `${id}_chair_6` && chair.status === "Occupied" ? chair  : null) : null);
   }) );




  

  let chairIsOccupied;
  let userName6;
  let userImage6;
  let userCity6;
  let userCountry6;
  let userOrganisation6;
  let userDesignation6;
  let displayPopUp = "auto";
  let displayAvatar = "auto";

  if (chair) {
    // What if chair_1 is occupied
    chairIsOccupied = true;

    userName6 = chair.userName;
    userImage6 = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${chair.userImage}`;
    userCity6 = chair.userCity;
    userCountry6 = chair.userCountry;
    userOrganisation6 = chair.userOrganisation;
    userDesignation6 = chair.userDesignation;
    
  }
  else {
    // What if chair_1 is not occupied
    chairIsOccupied = false;

    
    displayPopUp = "none";
    displayAvatar = "none";
  }



  const params = useParams();
  // console.log(params);

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
      image.id = `${id}_chair_6_img_blob`;
  
      if (imgURL) {
        document.getElementById(`${id}_chair_6_img`).appendChild(image);
      } else {
        let element = document.getElementById(`${id}_chair_6_img`);
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
      }
    }
  
  
    useEffect(() => {
      if (userImage) {
        fetchImage(userImage6, id).catch((e) => {
          console.log(
            "There has been a problem with your fetch operation: " + e.message
          );
        });
      } else {
        document.getElementById(`${id}_chair_6_img_blob`).remove();
      }
     
    }, [userImage6, id, userImage]);


  return (
    <>
      <div
        className="lower-chair-wrapper"
        id={`${id}_chair_6`}
        onClick={() => {
          console.log(`${id}_chair_6`);

          dispatch(
            userActions.EditCurrentlyJoinedChair({
              chairId: `${id}_chair_6`,
            })
          );

          socket.emit(
            "updateChair",
            {
              eventId,
              tableId: id,
              chairId: `${id}_chair_6`,
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
                    id={`${id}_chair_6_img`}
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
                  <div  style={{display: displayPopUp}}>
                    <div className="d-flex flex-row align-items-center" style={{display: displayPopUp}}>
                      <Avatar
                        alt="Remy Sharp"
                        src={userImage6}
                        variant="rounded" style={{display: displayPopUp}}
                      />
                      <div className="ms-3" style={{display: displayPopUp}}>
                        <div
                          className="btn-outline-text"
                          style={{ fontSize: "14px", display: displayPopUp }}
                        >
                          {userName6}
                        </div>
                        <div className="people-headline" style={{display: displayPopUp}}>
                          {userDesignation6} at {userOrganisation6}
                        </div>
                        <div className="people-location" style={{display: displayPopUp}}>{userCity6}, {userCountry6}</div>
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

export default LOWER_6_CHAIR;
