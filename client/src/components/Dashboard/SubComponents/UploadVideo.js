import React from "react";
import styled from "styled-components";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import VideoPNG from "./../../../assets/images/UploadVideo.svg";

import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

const Heading = styled.div`
  font-weight: 600;
  font-family: "Ubuntu";
  font-size: 1.4rem;
  color: #212121;
`;

const BeforePreviewContainer = styled.div`
  width: 100%;
  height: 320px;
  border-radius: 10px;
  background-color: #ffffff;

  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 #ececec;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const IllustrationImg = styled.img`
  height: 280px;
  width: auto;
  object-fit: contain;
`;

const FormLabel = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #212121;
  font-size: 0.8rem;
`;

const VideoContainer = styled.video`
  width: 100%;
  height: 320px;
  border-radius: 10px;
  background-color: #ffffff;

  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 #ececec;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  object-fit: contain;
`;

const UploadVideo = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [file, setFile] = React.useState(null);

  const [fileToPreview, setFileToPreview] = React.useState(null);

  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="p-4" style={{ height: "auto", width: "580px" }}>
          <div className="d-flex flex-row align-items-center justify-content-between mb-4">
            <Heading>Upload video</Heading>

            <IconButton onClick={handleClose}>
              <CancelRoundedIcon />
            </IconButton>
          </div>

          {fileToPreview ? (
            <VideoContainer
              controls
              autoplay={true}
              src={fileToPreview}
            ></VideoContainer>
          ) : (
            <BeforePreviewContainer className="d-flex flex-column align-items-center justify-content-center mb-4">
              <IllustrationImg src={VideoPNG}></IllustrationImg>
            </BeforePreviewContainer>
          )}

          <FormLabel className="mb-2">Choose video file</FormLabel>
          <input
            onChange={(e) => {
              onFileChange(e);
            }}
            type="file"
            accept="video/mp4,video/x-m4v,video/*"
            className="form-control mb-5"
          ></input>

          <button
            className="btn btn-primary btn-outline-text"
            style={{ width: "100%" }}
          >
            Upload video
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default UploadVideo;
