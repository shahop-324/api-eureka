import React from "react";
import styled from "styled-components";
import Faker from "faker";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Dialog, IconButton } from "@material-ui/core";

import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";

import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

import CancelIcon from '@mui/icons-material/Cancel';

import { BtnOutlined } from "../SessionStage/Elements";

const PersonProfileBody = styled.div`
  width: 360px;
  max-height: 80vh;
  height: 500px;
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

const PersonProfile = ({
  open,
  handleClose,
  userName,
  userImage,
  userOrganisation,
  userDesignation,
}) => {
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <PersonProfileBody>
            <IconButton className="icon-btn" style={{position: 'absolute', top: "16px", right: "16px", zIndex: "1"}}>
            <CancelIcon style={{color: "inherit"}} onClick={() => {
                handleClose()
            }}/>
            </IconButton>
          <div className="d-flex flex-row align-items-center justify-content-center mb-4">
            <Avatar
              src={userImage}
              alt={Faker.name.findName()}
              variant="rounded"
              style={{ width: "72px", height: "72px" }}
            />
          </div>
          <ProfileName className="mb-2">{userName}</ProfileName>
          <ProfileDesignationOrg className="mb-5">{`${userOrganisation}, ${userDesignation}`}</ProfileDesignationOrg>

          <div className="d-flex flex-row align-items-center justify-content-center mb-4">
            <FacebookIcon
              style={{ fontSize: "28px", color: "#4267B2" }}
              className="me-4"
            />
            <LinkedInIcon
              style={{ fontSize: "28px", color: "#0077b5" }}
              className="me-4"
            />
            <TwitterIcon
              style={{ fontSize: "28px", color: "#1DA1F2" }}
              className="me-4"
            />
            <InstagramIcon
              style={{ fontSize: "28px", color: "#DD2A7B" }}
              className="me-4"
            />
            <LanguageIcon style={{ fontSize: "32px", color: "#152d35" }} />
          </div>

          {/* <BtnOutlined></BtnOutlined> */}
          <div className="mb-3">
            <ProfileSmallText className="mb-1">Headline</ProfileSmallText>
            <ProfileMediumText>
              Introduce yourself to others in few words.
            </ProfileMediumText>
          </div>
          <div className="mb-5">
            <ProfileSmallText className="mb-2">Interests</ProfileSmallText>
            {/* <ProfileMediumText>
              Introduce yourself to others in few words.
            </ProfileMediumText> */}
            <div>
              <Chip
                label="Technology"
                color="primary"
                variant="outlined"
                className="me-2"
              />
              <Chip
                label="E-commerce"
                color="primary"
                variant="outlined"
                className="me-2"
              />
              <Chip
                label="Sass"
                color="primary"
                variant="outlined"
                className="me-2"
              />
            </div>

          </div>
          <div className="d-flex flex-row align-items-center justify-content-between">
            <ButtonFilledDark style={{width: "48%"}}>Start instant meet</ButtonFilledDark>
            <ButtonOutlinedDark style={{width: "48%"}}>Schedule meet</ButtonOutlinedDark>
            </div>
        </PersonProfileBody>
      </Dialog>
    </>
  );
};

export default PersonProfile;
