import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../reducers/userSlice";
import { Avatar } from "@material-ui/core";
import { Popup } from "semantic-ui-react";
import socket from "../service/socket";
import { useParams } from "react-router";

const LOWER_7_CHAIR = ({ id, launchTableScreen }) => {
  const dispatch = useDispatch();

  const chair = useSelector((state) =>
    state.rooms.chairs.find((chair) => {
      return chair && chair.chairId
        ? chair.chairId === `${id}_chair_7` && chair.status === "Occupied"
          ? chair
          : null
        : null;
    })
  );

  const chairArrangement = useSelector((state) => state.rooms.chairs);

  let chairIsOccupied;
  let userName7;
  let userImage7;
  let userCity7;
  let userCountry7;
  let userOrganisation7;
  let userDesignation7;
  let displayPopUp = "auto";

  if (chair) {
    // What if chair_7 is occupied
    chairIsOccupied = true;

    userName7 = chair.userName;
    userImage7 = chair.userImage.startsWith("https://")
      ? chair.userImage
      : `https://bluemeet.s3.us-west-1.amazonaws.com/${chair.userImage}`;
    userCity7 = chair.userCity;
    userCountry7 = chair.userCountry;
    userOrganisation7 = chair.userOrganisation;
    userDesignation7 = chair.userDesignation;
  } else {
    // What if chair_7 is not occupied
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
    image.style.borderBottomLeftRadius = "5px";
    image.style.borderBottomRightRadius = "5px";
    image.id = `${id}_chair_7_img_blob`;

    if (imgURL) {
      document.getElementById(`${id}_chair_7_img`).appendChild(image);
    } else {
      let element = document.getElementById(`${id}_chair_7_img`);
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  };

  useEffect(() => {
    if (userImage) {
      fetchImage(userImage7, id).catch((e) => {
        // console.log(
        //   "There has been a problem with your fetch operation: " + e.message
        // );
      });
    } else {
      document.getElementById(`${id}_chair_7_img_blob`).remove();
    }
  }, [userImage7, id, userImage]);

  useEffect(() => {
    return 1 + 1;
  }, [chairArrangement, chairIsOccupied, chairArrangement.length]);

  return (
    <>
      <div
        className="lower-chair-wrapper"
        id={`${id}_chair_7`}
        onClick={() => {
          console.log(`${id}_chair_7`);

          dispatch(
            userActions.EditCurrentlyJoinedChair({
              chairId: `${id}_chair_7`,
            })
          );

          socket.emit(
            "updateChair",
            {
              eventId,
              tableId: id,
              chairId: `${id}_chair_7`,
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

          // dispatch(fetchTwillioVideoRoomToken(userId, id, launchTableScreen));

          launchTableScreen();
        }}
      >
        <div className="lower-chair chair pt-2">
          <div style={{ transform: "translateY(0)" }}>
            <Popup
              trigger={
                <div
                  id={`${id}_chair_7_img`}
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
              <div style={{ display: displayPopUp }}>
                <div
                  className="d-flex flex-row align-items-center"
                  style={{ display: displayPopUp }}
                >
                  <Avatar
                    alt={userName7}
                    src={userImage7}
                    variant="rounded"
                    style={{ display: displayPopUp }}
                  />
                  <div className="ms-3" style={{ display: displayPopUp }}>
                    <div
                      className="btn-outline-text"
                      style={{ fontSize: "14px", display: displayPopUp }}
                    >
                      {userName7}
                    </div>
                    <div
                      className="people-headline"
                      style={{ display: displayPopUp }}
                    >
                      {userDesignation7} at {userOrganisation7}
                    </div>
                    <div
                      className="people-location"
                      style={{ display: displayPopUp }}
                    >
                      {userCity7}, {userCountry7}
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

export default LOWER_7_CHAIR;
