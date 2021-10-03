import React from "react";
import styled from "styled-components";

import Divider from "@material-ui/core/Divider";
import { alpha, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import VideoLibraryListFields from "./GridComponents/VideoLibrary/ListFields";
import VideoLibraryDetailsCard from "./GridComponents/VideoLibrary/DetailsCard";
import UploadVideo from "./SubComponents/UploadVideo";
import { useParams } from "react-router";
import LinkVideoFromLibrary from "./SubComponents/LinkVideoFromLibrary";

const SectionHeading = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: #212121;
  font-family: "Ubuntu";
`;

const TextSmall = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.78rem;
  color: #414141;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const VideoLibrary = () => {

  const params = useParams();

  let eventId = params.id;
  let communityId = params.communityId;
  if (eventId && communityId) {
    console.log("We are in an event");
  } else {
    console.log("we are in main dashboard");
  }

  const [openUploadVideo, setOpenUploadVideo] = React.useState(false);

  const [openLinkVideoFromLibrary, setOpenLinkVideoFromLibrary] =
    React.useState(false);

  const handleCloseUploadVideo = () => {
    setOpenUploadVideo(false);
  };

  const handleOpenUploadVideo = () => {
    setOpenUploadVideo(true);
  };

  const handleCloseLinkVideoFromLibrary = () => {
    setOpenLinkVideoFromLibrary(false);
  };

  const handleOpenLinkVideoFromLibrary = () => {
    setOpenLinkVideoFromLibrary(true);
  };

  const classes = useStyles();

 
  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 pt-4">
          <SectionHeading className="">
            Stream Pre-recorded videos
          </SectionHeading>
          <div className="sec-heading-action-button d-flex flex-row">
            

            <div className="d-flex flex-row align-items-center">
              { eventId && communityId ? <button
                className="btn btn-outline-primary btn-outline-text mx-3"
                onClick={handleOpenLinkVideoFromLibrary}
              >
                Link Video from Library
              </button> : <div className="ms-3"></div> }
              
              <button
                className="btn btn-primary btn-outline-text"
                onClick={handleOpenUploadVideo}
              >
                Upload video
              </button>
            </div>
          </div>
        </div>
        <TextSmall className="mx-4 mb-4">
          {eventId && communityId
            ? "These videos will be available for you to stream directly in all sessions of this event."
            : "These videos can be linked to any event in your community."}
        </TextSmall>

        <div className="event-management-content-grid px-3 mx-3 mb-4 py-4">
          <VideoLibraryListFields />
          <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
            <Divider />
          </div>
          <VideoLibraryDetailsCard />
          <VideoLibraryDetailsCard />
          <VideoLibraryDetailsCard />
          <VideoLibraryDetailsCard />
        </div>
      </div>
      <UploadVideo
        open={openUploadVideo}
        handleClose={handleCloseUploadVideo}
      />
      <LinkVideoFromLibrary
        open={openLinkVideoFromLibrary}
        handleClose={handleCloseLinkVideoFromLibrary}
      />
    </>
  );
};

export default VideoLibrary;
