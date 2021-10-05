import React, { useState } from "react";
import styled from "styled-components";
import Divider from "@material-ui/core/Divider";
import LiveStreamListFields from "../GridComponents/LiveStream/ListFields";
import LiveStreamDetailsCard from "../GridComponents/LiveStream/DetailsCard";
import AddStreamDestinationOptions from "../FormComponents/AddStreamDestinationOptions";

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

const LiveStream = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 pt-4">
          <SectionHeading className="">Live stream</SectionHeading>

          <div className="sec-heading-action-button d-flex flex-row">
            <div className="d-flex flex-row align-items-center">
              <button
                className="btn btn-primary btn-outline-text"
                onClick={handleOpen}
              >
                Add stream destination
              </button>
            </div>
          </div>
        </div>
        <TextSmall className="mx-4 mb-4">
          You can setup live stream destinations to go live from your event on
          any third party streaming software which supports RTMP.
        </TextSmall>
        <div className="event-management-content-grid px-3 mx-3 mb-4 py-4">
          <LiveStreamListFields />
          <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
            <Divider />
          </div>
          <LiveStreamDetailsCard />
          {/* <VideoLibraryDetailsCard />
          <VideoLibraryDetailsCard />
          <VideoLibraryDetailsCard />
          <VideoLibraryDetailsCard /> */}
        </div>
      </div>
      <AddStreamDestinationOptions open={open} handleClose={handleClose} />
    </>
  );
};

export default LiveStream;
