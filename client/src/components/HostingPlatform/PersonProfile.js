import React from "react";
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
import { useSelector } from "react-redux";

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

  color: #152d35;
  background-color: transparent;

  border: 1px solid #152d35;
  border-radius: 5px;

  &:hover {
    background-color: #152d35;

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

const PersonProfile = ({
  open,
  handleClose,
  userId,
  userName,
  userImage,
  userOrganisation,
  userDesignation,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { registrations } = useSelector((state) => state.registration);

  const userRegistrationDetails = registrations.find(
    (element) => element.bookedByUser === userId
  );

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <PersonProfileBody>
          <IconButton
            className="icon-btn"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: "1",
            }}
          >
            <CancelIcon
              style={{ color: "inherit" }}
              onClick={() => {
                handleClose();
              }}
            />
          </IconButton>
          <div className="d-flex flex-row align-items-center justify-content-center mb-4">
            <Avatar
              src={userImage}
              alt={userName}
              variant="rounded"
              style={{ width: "72px", height: "72px" }}
            />
          </div>
          <ProfileName className="mb-2">{userName}</ProfileName>
          <ProfileDesignationOrg className="mb-5">{`${userOrganisation}, ${userDesignation}`}</ProfileDesignationOrg>

          {userRegistrationDetails ? (
            <div className="d-flex flex-row align-items-center justify-content-center mb-4">
              {userRegistrationDetails.socialMediaHandles ? (
                userRegistrationDetails.socialMediaHandles.facebook ? (
                  <a
                    href={`//${userRegistrationDetails.socialMediaHandles.facebook}`}
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

              {userRegistrationDetails.socialMediaHandles ? (
                userRegistrationDetails.socialMediaHandles.linkedin ? (
                  <a
                    href={`//${userRegistrationDetails.socialMediaHandles.linkedin}`}
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

              {userRegistrationDetails.socialMediaHandles ? (
                userRegistrationDetails.socialMediaHandles.twitter ? (
                  <a
                    href={`//${userRegistrationDetails.socialMediaHandles.twitter}`}
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

              {userRegistrationDetails.socialMediaHandles ? (
                userRegistrationDetails.socialMediaHandles.website ? (
                  <a
                    href={`//${userRegistrationDetails.socialMediaHandles.website}`}
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

          {/* <BtnOutlined></BtnOutlined> */}
          {userRegistrationDetails ? (
            <div className="mb-3">
              {userRegistrationDetails.headline ? (
                <>
                  {" "}
                  <ProfileSmallText className="mb-1">Headline</ProfileSmallText>
                  <ProfileMediumText>
                    {userRegistrationDetails.headline}
                  </ProfileMediumText>{" "}
                </>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          {userRegistrationDetails ? (
            userRegistrationDetails.interests ? (
              <div className="mb-4">
                <ProfileSmallText className="mb-2">Interests</ProfileSmallText>

                <div>{renderInterests(userRegistrationDetails.interests)}</div>
              </div>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}

          <div className="d-flex flex-row align-items-center justify-content-between">
            <ButtonFilledDark style={{ width: "100%" }}>
              Connect
            </ButtonFilledDark>
            {/* <ButtonOutlinedDark style={{width: "48%"}}>Schedule meet</ButtonOutlinedDark> */}
          </div>
        </PersonProfileBody>
      </Dialog>
    </>
  );
};

export default PersonProfile;
