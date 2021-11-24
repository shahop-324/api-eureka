import React from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import { Popup } from "semantic-ui-react";

import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";

const Container = styled.div`
  border-radius: 15px;
  background-color: #212121;

  video {
    object-fit: ${(props) =>
      props && props.isScreenTrack ? "contain !important" : "cover !important"};
  }
`;

const UserIdentity = styled.div`
  border-radius: 10px;
  background-color: #e9e9e923;

  font-weight: 500;
  font-size: 0.8rem;
  color: #bdb107;

  position: absolute;
  bottom: 16px;
  left: 16px;
`;

const VideoPlayer = ({
  name,
  image,
  userId,
  camera,
  mic,
  height,
  isScreenTrack,
}) => {
  let isMe = false;
  const userDetails = useSelector((state) => state.user.userDetails);

  // console.log(camera, "This is the camera state as we are tracking it right now.");

  if (userId === userDetails._id) {
    isMe = true;
  }

  console.log(userId);

  return (
    <>
      <Container
        isScreenTrack={isScreenTrack}
        style={{
          height: height ? height : "auto",
          marginBottom: height ? "12px" : "0px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "15px",
          }}
          id={userId}
        ></div>
        {!isScreenTrack ? (
          camera ? (
            <></>
          ) : (
            <div
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: "0",
                left: "0",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            >
              <Avatar
                alt={name}
                src={image}
                sx={{ width: 56, height: 56 }}
                variant="rounded"
              />
            </div>
          )
        ) : (
          <></>
        )}

        {!isScreenTrack && (
          <UserIdentity className="d-flex flex-row align-items-center p-3">
            <span className="">
              {name} {isMe ? "(You)" : <></>}
            </span>
            {mic ? (
              <MicRoundedIcon style={{ color: "#45AC15" }} className="ms-3" />
            ) : (
              <MicOffRoundedIcon
                style={{ color: "#AC1A15" }}
                className="ms-3"
              />
            )}
          </UserIdentity>
        )}
      </Container>
    </>
  );
};

export default VideoPlayer;
