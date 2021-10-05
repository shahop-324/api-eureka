import React from "react";
import styled from "styled-components";
import Divider from "@material-ui/core/Divider";
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

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 pt-4">
          <SectionHeading className="">
            Stream Pre-recorded videos
          </SectionHeading>
          <div className="sec-heading-action-button d-flex flex-row">
            <div className="d-flex flex-row align-items-center">
              {eventId && communityId ? (
                <button
                  className="btn btn-outline-primary btn-outline-text mx-3"
                  onClick={handleOpenLinkVideoFromLibrary}
                >
                  Link Video from Library
                </button>
              ) : (
                <div className="ms-3"></div>
              )}

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
