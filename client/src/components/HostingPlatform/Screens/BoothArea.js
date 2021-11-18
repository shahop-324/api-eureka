/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Faker from "faker";
import { useDispatch, useSelector } from "react-redux";
import "./../Styles/booth.scss";
import LanguageRoundedIcon from "@material-ui/icons/LanguageRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { Avatar, makeStyles } from "@material-ui/core";
import Rooms from "./Rooms";
import BoothLiveStream from "./BoothLiveStream";
import styled from "styled-components";
import Chip from "@mui/material/Chip";
import { IconButton } from "@material-ui/core";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { SetCurrentBoothId } from "./../../../actions";
import Loader from "./../../Loader";
import { fetchBooth } from "./../../../actions";
import GetInTouchForm from "./Sub/FormComponents/GetInTouchForm";

import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import EditBoothDrawer from "./Sub/FormComponents/EditBoothDrawer";

import { PopupButton } from "@typeform/embed-react";

const ThemedBackgroundButtonOutlined = styled.div`
  background-color: #152d35 !important;
  text-decoration: none !important;
  color: #ffffff !important;
  border: 1px solid transparent;
  outline: none !important;

  &:hover {
    background-color: transparent !important;
    color: #152d35 !important;
    border: 1px solid #152d35 !important;
    cursor: pointer !important;
  }
`;
const ThemedBackgroundButtonFilled = styled.div`
  outline: none !important;
  background-color: #152d35 !important;
  border: 1px solid #152d35 !important;
  color: #ffffff;

  &:hover {
    color: #152d35 !important;
    background-color: transparent !important;
    text-decoration: none !important;
    cursor: pointer;
  }
`;

const BasicGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 24px;
`;

const GetInTouchCard = styled.div`
  border-radius: 10px;
  background-color: #ffffff;
  padding: 10px;
  width: 100%;
  height: auto;
`;

const DemoRoomCard = styled.div`
  height: 220px;
  border-radius: 10px;
  background-color: #ffffff;
  padding: 10px;
  width: 100%;
`;

const Videos = styled.div`
  height: 260px;
  border-radius: 10px;
  background-color: #ffffff;
  padding: 10px;
  width: 100%;

  display: grid;
  grid-template-columns: 0.1fr 1fr 1fr 1fr 0.1fr;
  grid-gap: 24px;
  align-items: center;
`;
const ProductsAndServices = styled.div`
  height: 260px;
  border-radius: 10px;
  background-color: #ffffff;
  padding: 10px;
  width: 100%;

  display: grid;
  grid-template-columns: 0.1fr 1fr 1fr 0.1fr;
  grid-gap: 24px;
  align-items: center;
`;

const VideoCard = styled.video`
  border-radius: 15px;
  height: 230px;
  width: 100%;
  background-color: #212121;
`;

const Files = styled.div`
  border-radius: 10px;
  background-color: #ffffff;
  padding: 10px;
  width: 100%;
  height: 260px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
  align-items: center;
`;

const FileTab = styled.div`
  border-radius: 20px;
  border: 1px solid #b9b9b9;
  padding: 12px;
  color: #152d35;

  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    background: #e5e9f1;
    -webkit-box-shadow: 12px 12px 24px #e5e9f1, -12px -12px 24px #f0f8ff;
    box-shadow: 12px 12px 24px #e5e9f1, -12px -12px 24px #f0f8ff;
  }
`;

const FileName = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
  color: #152d35;
`;

const OffersCard = styled.div`
  border-radius: 10px;
  background-color: #ffffff;
  padding: 10px;
  width: 100%;
`;

const SocialButton = styled.div`
  border: 1px solid #ffffff !important;

  &:hover {
    background-color: #ffffff !important;
    border: 1px solid #152d35 !important;
    cursor: pointer;
  }
`;

const ContactInfo = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
`;

const ProductCard = styled.div`
  border-radius: 20px;
  height: 230px;
  padding: 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1px solid transparent;
  &:hover {
    cursor: pointer;
    border: 1px solid #b9b9b9;
  }
`;

const ProductImage = styled.img`
  border-radius: 20px;
  max-height: 150px;
  object-fit: contain;
  justify-self: center;
  /* border: 1px solid #212121; */
`;

const ProductName = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
  color: #152d35;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

// <LobbyAgenda socket={socket} />

const renderTags = (tags) => {
  return tags.map((tag) => {
    return (
      <Chip
        label={tag}
        variant="outlined"
        className="me-2"
        style={{ color: "#152d35", border: "1px solid #152d35" }}
      />
    );
  });
};

const BoothArea = () => {
  const dispatch = useDispatch();

  const [openGetInTouch, setOpenGetInTouch] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleCloseGetInTouch = () => {
    setOpenGetInTouch(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const { currentBoothId, boothDetails } = useSelector((state) => state.booth);

  useEffect(() => {
    dispatch(fetchBooth(currentBoothId));
  }, []);

  const classes = useStyles();

  const truncateText = (str, n) => {
    return str.length > n ? `${str.substring(0, n)} ...` : str;
  };

  if (!boothDetails) {
    return <Loader />;
  }

  return (
    <>
      <div
        style={{ maxWidth: "1360px", margin: "0 auto" }}
        className="py-4 px-5"
      >
        <div className="d-flex flex-row align-items-center justify-content-between mb-4">
          <div className="d-flex flex-row align-items-center">
            <IconButton
              onClick={() => {
                dispatch(SetCurrentBoothId(null));
              }}
            >
              <ArrowBackIosRoundedIcon style={{ fontSize: "20px" }} />
            </IconButton>

            <div
              className="ms-3"
              style={{ color: "#212121", fontWeight: "500" }}
            >
              Back
            </div>
          </div>

          <div>
            <ThemedBackgroundButtonOutlined
              onClick={() => {
                setOpenEdit(true);
              }}
              className="btn btn-outline-text d-flex flex-row align-items-center"
            >
              <EditRoundedIcon className="me-2" style={{ fontSize: "18px" }} />
              <span>Edit</span>
            </ThemedBackgroundButtonOutlined>
          </div>
        </div>

        <div className="mb-4">
          <img
            src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${boothDetails.boothPoster}`}
            alt={boothDetails.name}
            style={{
              width: "100%",
              maxHeight: "390px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>

        <div
          className="mb-4"
          style={{
            display: "grid",
            gridTemplateColumns: "4fr 1.5fr",
            alignItems: "center",
          }}
        >
          <div
            style={{ height: "100px" }}
            className="d-flex flex-row align-items-center"
          >
            <Avatar
              src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${boothDetails.image}`}
              style={{ height: "5rem", width: "5rem" }}
              variant="rounded"
              alt={boothDetails.name}
            />
            <div className="ms-3">
              <div
                style={{
                  color: "#3C3A3A",
                  fontWeight: "500",
                  fontFamily: "Ubuntu",
                  fontSize: "1.1rem",
                }}
                className="mb-3"
              >
                {boothDetails.name}
              </div>

              <div className="booth-tagline">{boothDetails.tagline}</div>
            </div>
          </div>
          <div style={{ height: "100px" }}>
            <div className="d-flex flex-row align-items-center justify-content-end mb-3">
              {boothDetails.socialMediaHandles.website && (
                <SocialButton
                  className="button-custom-bg p-2 ms-3"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <a
                    href={`//${boothDetails.socialMediaHandles.website}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LanguageRoundedIcon
                      style={{ fontSize: "24px", color: "#538BF7" }}
                    />
                  </a>
                </SocialButton>
              )}

              {boothDetails.socialMediaHandles.linkedIn && (
                <SocialButton
                  className="button-custom-bg p-2 ms-3"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <a
                    href={`//${boothDetails.socialMediaHandles.linkedIn}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkedInIcon
                      style={{ fontSize: "24px", color: "#0e76a8" }}
                    />
                  </a>
                </SocialButton>
              )}

              {boothDetails.socialMediaHandles.twitter && (
                <SocialButton
                  className="button-custom-bg p-2 ms-3"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <a
                    href={`//${boothDetails.socialMediaHandles.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TwitterIcon
                      style={{ fontSize: "24px", color: "#1DA1F2" }}
                    />
                  </a>
                </SocialButton>
              )}

              {boothDetails.socialMediaHandles.facebook && (
                <SocialButton
                  className="button-custom-bg p-2 ms-3"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <a
                    href={`//${boothDetails.socialMediaHandles.facebook}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FacebookIcon
                      style={{ fontSize: "24px", color: "#3b5998" }}
                    />
                  </a>
                </SocialButton>
              )}
            </div>

            <div className="d-flex flex-row align-items-center justify-content-end mb-3">
              {/* <ThemedBackgroundButtonFilled className="btn btn-primary btn-outline-text">
                <FileDownloadRoundedIcon />
            <span className="ms-2">    Download Business Cards </span>
              </ThemedBackgroundButtonFilled> */}
              <PopupButton
              className="btn btn-outline-text btn-dark me-3"
          id="HLjqXS5W"
          // style={{ padding: 8, fontSize: 16 }}
          size={80}
        >
          Take survey
        </PopupButton>
              <ThemedBackgroundButtonFilled className="btn btn-primary btn-outline-text">
                <span> Share Business Card </span>
              </ThemedBackgroundButtonFilled>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="booth-about-heading mb-3">About</div>
          <div className="d-flex flex-row align-items-center mb-3">
            {renderTags(boothDetails.tags)}
          </div>

          <div className="booth-description">{boothDetails.description}</div>
        </div>

        <BasicGrid className="mb-5">
          <ProductsAndServices>
            <IconButton>
              <ArrowLeftRoundedIcon />
            </IconButton>
            <VideoCard
              // controls={true}
              src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/video.mp4`}
            />
            <VideoCard
              // controls={true}
              src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/video.mp4`}
            />
            <IconButton>
              <ArrowRightRoundedIcon />
            </IconButton>
          </ProductsAndServices>
          <GetInTouchCard className="p-4">
            <div className="d-flex flex-row align-items-center pb-3 px-2">
              <MailOutlineRoundedIcon />

              <ContactInfo className="ms-3">
                {truncateText(Faker.internet.email(), 25)}
              </ContactInfo>
            </div>

            <div className="d-flex flex-row align-items-center py-3 px-2">
              <PhoneRoundedIcon />
              <ContactInfo className="ms-3">
                {truncateText(Faker.phone.phoneNumber(), 30)}
              </ContactInfo>
            </div>

            {/* <div className="d-flex flex-row align-items-center justify-content-end">
              <button
                onClick={() => {
                  setOpenGetInTouch(true);
                }}
                className="btn btn-outline-text btn-outline-primary"
              >
                {" "}
                <EditRoundedIcon style={{ fontSize: "17px" }} />{" "}
                <span className="ms-2"> Edit </span>{" "}
              </button>
            </div> */}
          </GetInTouchCard>

          <Videos>
            <IconButton>
              <ArrowLeftRoundedIcon />
            </IconButton>

            <ProductCard>
              <ProductImage
                className="mb-3"
                src={`https://ss7.vzw.com/is/image/VerizonWireless/apple-watch-series-6-blue-aluminum-sport-band-40-mm-m02r3lla-a`}
              />
              <ProductName>Apple watch series 6</ProductName>
            </ProductCard>
            <ProductCard>
              <ProductImage
                className="mb-3"
                src={`https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-red-select-2020?wid=940&hei=1112&fmt=png-alpha&.v=1604343703000`}
              />
              <ProductName>iPhone 12 64 GB</ProductName>
            </ProductCard>
            <ProductCard>
              <ProductImage
                className="mb-3"
                src={`https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-spacegray-select-202011_GEO_US?wid=904&hei=840&fmt=jpeg&qlt=80&.v=1632948875000`}
              />
              <ProductName>MacBook Pro 2021 512 GB</ProductName>
            </ProductCard>

            <IconButton>
              <ArrowRightRoundedIcon />
            </IconButton>
          </Videos>
          <div></div>

          <Files className="py-3">
            <div className="px-3">
              <FileTab>
                <DescriptionRoundedIcon />
                <FileName className="ms-2">How to get started ?</FileName>
              </FileTab>
            </div>
            <div className="px-3">
              <FileTab>
                <DescriptionRoundedIcon />
                <FileName className="ms-2">How to get started ?</FileName>
              </FileTab>
            </div>
            <div className="px-3">
              <FileTab>
                <DescriptionRoundedIcon />
                <FileName className="ms-2">How to get started ?</FileName>
              </FileTab>
            </div>
            <div className="px-3">
              <FileTab>
                <InsertLinkRoundedIcon />
                <FileName className="ms-2">How to get started ?</FileName>
              </FileTab>
            </div>
            <div className="px-3">
              <FileTab>
                <InsertLinkRoundedIcon />
                <FileName className="ms-2">How to get started ?</FileName>
              </FileTab>
            </div>
          </Files>
          <div></div>
        </BasicGrid>

        <div
          className="row d-flex flex-row"
          style={{ alignItems: "center", marginBottom: "6%" }}
        >
          <div className="col-5">
            <hr />
          </div>

          <div className="col-2 connect-with-us-booth-card d-flex flex-row align-items-center justify-content-between">
            <ExpandMoreRoundedIcon />

            <span className="join-us-here-booth">Join us here</span>
            <Avatar
              alt="Remy Sharp"
              src={Faker.image.avatar()}
              className={classes.small}
            />
          </div>
          <div className="col-5">
            <hr />
          </div>
        </div>

        <Rooms />
      </div>

      {/* <BoothLiveStream
        open={openLiveStream}
        handleClose={handleCloseLiveStream}
      /> */}

      <GetInTouchForm
        open={openGetInTouch}
        handleClose={handleCloseGetInTouch}
      />

      <EditBoothDrawer open={openEdit} handleClose={handleCloseEdit} />

     
    </>
  );
};

export default BoothArea;
