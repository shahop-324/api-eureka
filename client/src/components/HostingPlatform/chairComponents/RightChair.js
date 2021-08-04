import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../reducers/userSlice";
import { Avatar } from "@material-ui/core";
import { Popup } from "semantic-ui-react";
import socket from "../service/socket";
import { useParams } from "react-router";

const LeftChair = ({ id, launchTableScreen }) => {
  const dispatch = useDispatch();

  const chair = useSelector((state) => state.rooms.chairs.find((chair) => {
    return (chair && chair.chairId ? (chair.chairId === `${id}_chair_4` && chair.status === "Occupied" ? chair  : null) : null);
   }) );

   const chairArrangement = useSelector((state) => state.rooms.chairs);
 
 
 
   let chairIsOccupied;
   let userName4;
   let userImage4;
   let userCity4;
   let userCountry4;
   let userOrganisation4;
   let userDesignation4;
   let displayPopUp = "auto";
   
   if (chair) {
     // What if chair_1 is occupied
     chairIsOccupied = true;
 
     userName4 = chair.userName;
     userImage4 = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${chair.userImage}`;
     userCity4 = chair.userCity;
     userCountry4 = chair.userCountry;
     userOrganisation4 = chair.userOrganisation;
     userDesignation4 = chair.userDesignation;
     
   }
   else {
     // What if chair_1 is not occupied
     chairIsOccupied = false;
 
     
     displayPopUp = "none";
     
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
    image.style.borderTopRightRadius = "5px";
    image.style.borderBottomRightRadius = "5px";
    image.id = `${id}_chair_4_img_blob`;

    if (imgURL) {
      document.getElementById(`${id}_chair_4_img`).appendChild(image);
    } else {
      let element = document.getElementById(`${id}_chair_4_img`);
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }

    
  
    useEffect(() => {
      if (userImage) {
        fetchImage(userImage4, id).catch((e) => {
          console.log(
            "There has been a problem with your fetch operation: " + e.message
          );
        });
      } else {
        document.getElementById(`${id}_chair_4_img_blob`).remove();
      }
  

      
    }, [userImage4, userImage, id]);

   useEffect(() => {
    return 1+1;
    }, [chairArrangement, chairIsOccupied, chairArrangement.length])

  return (
    <>
      
        <div
              className="right-chair-wrapper"
              id={`${id}_chair_4`}
              onClick={() => {
                console.log(`${id}_chair_4`);

                dispatch(
                  userActions.EditCurrentlyJoinedChair({
                    chairId: `${id}_chair_4`,
                  })
                );

                socket.emit(
                  "updateChair",
                  {
                    eventId,
                    tableId: id,
                    chairId: `${id}_chair_4`,
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
              <div className="right-chair chair pt-2">
                <div style={{ transform: "translate(8px, -8px)" }}>
                  <Popup
                    trigger={
                      <div
                    id={`${id}_chair_4_img`}
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
                    position="right center"
                  >
                    <div style={{display: displayPopUp}}>
                      <div className="d-flex flex-row align-items-center" style={{display: displayPopUp}}>
                        <Avatar
                          alt="Remy Sharp"
                          src={userImage4}
                          variant="rounded" style={{display: displayPopUp}}
                        />
                        <div className="ms-3" style={{display: displayPopUp}}>
                          <div
                            className="btn-outline-text"
                            style={{ fontSize: "14px", display: displayPopUp }}
                          >
                            {userName4}
                          </div>
                          <div className="people-headline" style={{display: displayPopUp}}>
                            {userDesignation4} at {userOrganisation4}
                          </div>
                          <div className="people-location" style={{display: displayPopUp}}>{userCity4}, {userCountry4}</div>
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

export default LeftChair;
