import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Dialog, IconButton } from "@material-ui/core";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import socket from "./service/socket";
import ScheduleMeeting from "./Screens/Sub/ScheduleMeeting";
import {
  fetchMyConnections,
  setVenueRightDrawerSelectedTab,
  setChatSelectedTab,
  setPersonalChatConfig,
  setOpenVenueRightDrawer,
} from "./../../actions";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";

import UpdateEventProfile from "./../HostingPlatform/HelperComponents/UpdateEventProfile";
import α from "color-alpha";

const PersonProfileBody = styled.div`
  width: 360px;
  max-height: 80vh;
  padding: 32px 24px;
  background-color: #ffffff;
  position: relative;
`;

const ProfileName = styled.div`
  font-weight: 500;
  font-size: 1.1rem;
  color: #152d35;
  font-family: "Ubuntu";
  text-transform: capitalize;
  text-align: center;
`;

const ProfileSmallText = styled.div`
  font-weight: 500;
  font-size: 0.72rem;
  color: #152d35;
  font-family: "Ubuntu";
  text-transform: capitalize;
`;

const ProfileMediumText = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
  color: #222222;
  font-family: "Ubuntu";
  text-transform: capitalize;
`;

const ProfileDesignationOrg = styled.div`
  font-weight: 400;
  font-size: 0.8rem;
  color: #152d35;
  font-family: "Ubuntu";
  text-transform: capitalize;
  text-align: center;
`;

const ButtonFilledDark = styled.div`
  padding: 6px 10px;
  text-align: center;
  font-weight: 500;
  font-size: 0.8rem;
  color: #ffffff;
  font-family: "Ubuntu";
  background-color: #152d35;
  border: 1px solid #152d35;
  border-radius: 5px;

  &:hover {
    color: #152d35;
    background-color: transparent;
    cursor: pointer;
  }
`;

const ButtonOutlinedDark = styled.div`
  padding: 6px 10px;
  text-align: center;

  font-weight: 500;
  font-size: 0.8rem;
  color: #ffffff;
  font-family: "Ubuntu";

  color: ${(props) => (props && props.color ? α(props.color, 1.5) : "#152d35")};
  background-color: transparent;

  border: 1px solid
    ${(props) => (props && props.color ? α(props.color, 1.5) : "#152d35")};
  border-radius: 5px;

  &:hover {
    background-color: ${(props) =>
      props && props.color ? α(props.color, 1.5) : "#152d35"};

    color: #ffffff;

    cursor: pointer;
  }
`;

const renderInterests = (interests) => {
  return interests.map((element) => {
    return (
      <Chip
        label={element}
        color="primary"
        variant="outlined"
        className="me-2 mb-3"
        style={{ fontWeight: "500" }}
      />
    );
  });
};

const PersonProfile = ({ hideBtns, open, handleClose, person }) => {
  const [openUpdateProfile, setOpenUpdateProfile] = useState(false);

  const { eventDetails } = useSelector((state) => state.event);

  const handleCloseUpdateProfile = () => {
    setOpenUpdateProfile(false);
  };

  let isMe = false;

  const dispatch = useDispatch();
  const theme = useTheme();
  const params = useParams();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchMyConnections());
  }, []);

  const { userDetails } = useSelector((state) => state.user);

  const userId = userDetails._id;

  if (person._id.toString() === userId.toString()) {
    isMe = true;
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <PersonProfileBody>
          <IconButton
            onClick={() => {
              handleClose();
            }}
            className="icon-btn"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: "1",
            }}
          >
            <CancelIcon style={{ color: "inherit" }} />
          </IconButton>
          <div className="d-flex flex-row align-items-center justify-content-center mb-4">
            <Avatar
              src={
                person.image
                  ? person.image.startsWith("https://")
                    ? person.image
                    : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${person.image}`
                  : ""
              }
              alt={person.firstName}
              variant="rounded"
              style={{ width: "72px", height: "72px" }}
            />
          </div>
          <ProfileName className="mb-2">{`${person.firstName} ${person.lastName}`}</ProfileName>
          {person.organisation && person.designation ? (
            <ProfileDesignationOrg className="mb-5">{`${person.designation} ${person.organisation}`}</ProfileDesignationOrg>
          ) : (
            <div className="mb-4"></div>
          )}

          {person ? (
            <div className="d-flex flex-row align-items-center justify-content-center mb-4">
              {person.socialMediaHandles ? (
                person.socialMediaHandles.facebook ? (
                  <a
                    href={`//${person.socialMediaHandles.facebook}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FacebookIcon
                      style={{ fontSize: "28px", color: "#4267B2" }}
                      className="me-4"
                    />
                  </a>
                ) : (
                  <FacebookIcon
                    style={{ fontSize: "28px", color: "#C3C3C3" }}
                    className="me-4"
                  />
                )
              ) : (
                <></>
              )}

              {person.socialMediaHandles ? (
                person.socialMediaHandles.linkedin ? (
                  <a
                    href={`//${person.socialMediaHandles.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkedInIcon
                      style={{ fontSize: "28px", color: "#0077b5" }}
                      className="me-4"
                    />
                  </a>
                ) : (
                  <LinkedInIcon
                    style={{ fontSize: "28px", color: "#C3C3C3" }}
                    className="me-4"
                  />
                )
              ) : (
                <></>
              )}

              {person.socialMediaHandles ? (
                person.socialMediaHandles.twitter ? (
                  <a
                    href={`//${person.socialMediaHandles.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    <TwitterIcon
                      style={{ fontSize: "28px", color: "#1DA1F2" }}
                      className="me-4"
                    />{" "}
                  </a>
                ) : (
                  <TwitterIcon
                    style={{ fontSize: "28px", color: "#C3C3C3" }}
                    className="me-4"
                  />
                )
              ) : (
                <></>
              )}

              {person.socialMediaHandles ? (
                person.socialMediaHandles.website ? (
                  <a
                    href={`//${person.socialMediaHandles.website}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    <LanguageIcon
                      style={{ fontSize: "32px", color: "#152d35" }}
                    />{" "}
                  </a>
                ) : (
                  <LanguageIcon
                    style={{ fontSize: "32px", color: "#C3C3C3" }}
                  />
                )
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
          {person ? (
            <div className="mb-3">
              {person.headline ? (
                <>
                  {" "}
                  <ProfileSmallText className="mb-1">Headline</ProfileSmallText>
                  <ProfileMediumText>{person.headline}</ProfileMediumText>{" "}
                </>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
          {person ? (
            typeof person.interests !== "undefined" &&
            person.interests.length > 0 ? (
              <div className="">
                <ProfileSmallText className="mb-2">Interests</ProfileSmallText>

                <div>{renderInterests(person.interests)}</div>
              </div>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
          {!hideBtns && (
            <div className="d-flex flex-row align-items-center justify-content-between mt-4">
              {isMe ? (
                <ButtonOutlinedDark
                  color={eventDetails.color}
                  onClick={() => {
                    setOpenUpdateProfile(true);
                    handleClose();
                  }}
                  style={{ width: "100%" }}
                >
                  <EditRoundedIcon
                    style={{ fontSize: "18px" }}
                    className="me-2"
                  />{" "}
                  Edit profile
                </ButtonOutlinedDark>
              ) : (
                <ButtonOutlinedDark
                  onClick={() => {
                    dispatch(setVenueRightDrawerSelectedTab("feed"));
                    dispatch(setChatSelectedTab("private"));
                    dispatch(setPersonalChatConfig(person._id));
                    dispatch(setOpenVenueRightDrawer(true));
                    handleClose();
                  }}
                  style={{ width: "100%" }}
                >
                  <ChatRoundedIcon
                    style={{ fontSize: "18px" }}
                    className="me-2"
                  />{" "}
                  Message
                </ButtonOutlinedDark>
              )}
            </div>
          )}
        </PersonProfileBody>
      </Dialog>
      <ScheduleMeeting />
      <UpdateEventProfile
        openDrawer={openUpdateProfile}
        handleCloseDrawer={handleCloseUpdateProfile}
      />
    </>
  );
};

export default PersonProfile;
