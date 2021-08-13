import { Avatar } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";

import "./../Styles/Compatibility.scss";

import { Dropdown } from "semantic-ui-react";

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

const DeviceTest = ({ handleBack, handleNext }) => {
  const user = useSelector((state) => state.user);

  const isLoading = user.isLoading;
  const error = user.error;

  if (isLoading) {
    return (
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    );
  }
  if (error) {
    return alert(error);
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
      <div className="centered-box d-flex flex-column align-items-center justify-content-center">
        <div className="compatibility-test-section d-flex flex-row align-items-center">
          <div className="centered-box compatibility-box px-4 py-4">
            <div className="video-and-audio-test-box">
              <div className="video-test-box mb-4">
                <div
                  className="centered-box d-flex flex-row align-items-center"
                  style={{ height: "100%" }}
                >
                  <Avatar
                    className="centered-box"
                    src={imgURL}
                    alt={userName}
                    variant="rounded"
                    style={{ height: "4rem", width: "4rem" }}
                  />
                </div>
              </div>
              <div className="audio-level-indicator mb-4">
                <div className="audio-level-1 audio-indicator"></div>
                <div className="audio-level-2 audio-indicator"></div>
                <div className="audio-level-3 audio-indicator"></div>
                <div className="audio-level-4 audio-indicator"></div>
                <div className="audio-level-5 audio-indicator"></div>
              </div>
              <div className="audio-and-video-device-selector d-flex flex-row align-items-center justify-content-between">
                <DropdownVideoIcon />
                <DropdownAudioIcon />
              </div>
            </div>

            <div className="test-actions-btns d-flex flex-column justify-content-center px-5">
              <button
                className="btn btn-outline-text btn-primary mb-4"
                onClick={handleNext}
              >
                Proceed
              </button>
              <button
                className="btn btn-outline-text btn-outline-primary"
                onClick={handleBack}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceTest;
