import React, { useEffect } from "react";
import AvatarMenu from "../AvatarMenu";
import "./Styles/Compatibility.scss";

import { Dropdown } from "semantic-ui-react";
import { Avatar } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import CustomizedStepper from "./CustomizedStepper";
import { errorTrackerForFetchEvent, fetchEvent } from "../../actions";
import { useParams } from "react-router-dom";

const DropdownVideoIcon = () => (
  <Dropdown
    text="Video"
    icon="video"
    floating
    labeled
    button
    className="icon"
    style={{ fontSize: "14px" }}
  >
    <Dropdown.Menu>
      <Dropdown.Item text="Device 1" />
      <Dropdown.Item text="Device 2" />
    </Dropdown.Menu>
  </Dropdown>
);

const DropdownAudioIcon = () => (
  <Dropdown
    text="Audio"
    icon="microphone icon"
    floating
    labeled
    button
    className="icon"
    style={{ fontSize: "14px" }}
  >
    <Dropdown.Menu>
      <Dropdown.Item text="Microphone 1" />
      <Dropdown.Item text="Microphone 2" />
    </Dropdown.Menu>
  </Dropdown>
);

const CompatibilityTest = () => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const params = useParams();

  console.log(params);
  const eventId = params.eventId;

  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, []);

  

  const { isLoading, error } = useSelector((state) => state.event);

  if (isLoading) {
    return (
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    );
  }
  if(error) {
    alert(error);
    dispatch(errorTrackerForFetchEvent());
    return;
  }
  const image = user.userDetails.image;
  const userName = user.userDetails.firstName;

  let imgURL;

  if (image.startsWith("https://lh3.googleusercontent.com")) {
    imgURL = image;
  } else {
    imgURL = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${image}`;
  }

  return (
    <>
      <div className="full-page-body">
        <div className="simple-nav d-flex flex-row align-items-center justify-content-between px-5 py-2">
          <div className="navbar-brand">Evenz</div>
          <AvatarMenu />
        </div>

        <div className="compatibility-test-section d-flex flex-row align-items-start pt-5">
          <CustomizedStepper />
        </div>
      </div>
    </>
  );
};

export default CompatibilityTest;
