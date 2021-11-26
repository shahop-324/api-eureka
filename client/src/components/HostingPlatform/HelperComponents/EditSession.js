import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import styled from "styled-components";

import { Divider } from "@material-ui/core";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import {
  editSession,
  resetSessionPreviewUploadPercent,
  uploadSessionPreview,
  showInEventLobby,
  hideFromEventLobby,
} from "./../../../actions";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/styles";

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const Container = styled.div`
  height: auto;
  width: 100%;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 40px;
  background-color: #dadada;
  border-radius: 10px;
`;

const ProgressFill = styled.div`
  height: 40px;
  background-color: #47d188;
  border-radius: 10px;
`;

const ProgressText = styled.div`
  font-weight: 600;
  font-family: "Ubuntu";
  font-size: 0.9rem;
  color: #000000;
  padding-left: 32px;
`;

const IllustrationContainer = styled.div`
  height: 340px;
  width: 100%;
  background-color: #fbfbfb;
  border-radius: 10px;
  border: 1px dashed #cacaca;

  font-weight: 500;
  font-size: 1rem;
  color: #212121;

  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewContainer = styled.img`
  height: 340px;
  width: 100%;
  background-color: #dfdfdf;
  border-radius: 10px;
  border: none;
  object-fit: cover;
`;

const RoyalBlueSwitch = withStyles({
  switchBase: {
    color: "#538BF7",
    "&$checked": {
      color: "#3474F3",
    },
    "&$checked + $track": {
      backgroundColor: "#145DF0",
    },
  },
  checked: {},
  track: {},
})(Switch);

const EditSession = ({ open, handleClose, sessionId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const params = useParams();
  const eventId = params.eventId;
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { sessions, uploadPreviewPercent } = useSelector(
    (state) => state.session
  );

  const { eventDetails } = useSelector((state) => state.event);

  let sessionDetails = sessions.find(
    (el) => el._id.toString() === sessionId.toString()
  );

  let key;
  let imgUrl;

  if (sessionDetails) {
    key = sessionDetails.preview;
  }

  if (key) {
    imgUrl = `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${key}`;
  }

  const [file, setFile] = useState(null);
  const [fileToPreview, setFileToPreview] = useState(imgUrl);

  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };

  useEffect(() => {
    dispatch(resetSessionPreviewUploadPercent());
  }, []);

  const [sessionReplay, setSessionReplay] = useState(
    sessionDetails ? sessionDetails.replay : false
  );

  const [allowEntry, setAllowEntry] = useState(
    sessionDetails ? sessionDetails.allowEntryBeforeSessionBegin : false
  );

  const [showInLobby, setShowInLobby] = useState(
    eventDetails.highlightedSessions.includes(sessionId)
  );

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <>
          <HeaderFooter className="form-heading-and-close-button mb-4 px-4 py-3">
            <div></div>
            <div className="coupon-overlay-form-headline">Edit Session</div>
            <div className="overlay-form-close-button" onClick={handleClose}>
              <IconButton aria-label="delete">
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </HeaderFooter>

          <div className="create-new-coupon-form px-4 py-4">
            <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
              <div className="hosting-platform-widget-name">Show in Lobby</div>

              <div>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <RoyalBlueSwitch
                        checked={showInLobby}
                        onChange={(e) => {
                          console.log(e.target.checked);
                          setShowInLobby(e.target.checked);

                          if (e.target.checked) {
                            dispatch(
                              showInEventLobby(
                                { sessionId: sessionId },
                                eventId
                              )
                            );
                          } else {
                            dispatch(
                              hideFromEventLobby(
                                { sessionId: sessionId },
                                eventId
                              )
                            );
                          }
                        }}
                        name="showInLobby"
                      />
                    }
                  />
                </FormGroup>
              </div>
            </div>
            <div className="my-3">
              <Divider />
            </div>
            <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
              <div className="hosting-platform-widget-name">
                Allow Session Replay after end
              </div>

              <div>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <RoyalBlueSwitch
                        checked={sessionReplay}
                        onChange={(e) => {
                          console.log(e.target.checked);
                          setSessionReplay(e.target.checked);

                          dispatch(
                            editSession({ replay: e.target.checked }, sessionId)
                          );
                        }}
                        name="sessionReplay"
                      />
                    }
                  />
                </FormGroup>
              </div>
            </div>

            <div className="my-3">
              <Divider />
            </div>

            <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
              <div className="hosting-platform-widget-name">
                Allow Attendees to enter before session begins
              </div>

              <div>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <RoyalBlueSwitch
                        checked={allowEntry}
                        onChange={(e) => {
                          console.log(e.target.checked);
                          setAllowEntry(e.target.checked);

                          dispatch(
                            editSession(
                              {
                                allowEntryBeforeSessionBegin: e.target.checked,
                              },
                              sessionId
                            )
                          );
                        }}
                        name="allowEntryBeforeSesionBegin"
                      />
                    }
                  />
                </FormGroup>
              </div>
            </div>
            <div className="my-3">
              <Divider />
            </div>

            <Container className="p-4">
              {fileToPreview ? (
                <PreviewContainer
                  style={{ objectFit: "cover" }}
                  className="mb-4"
                  src={fileToPreview}
                ></PreviewContainer>
              ) : (
                <IllustrationContainer className="mb-4">
                  <span>Please select an image to upload</span>
                </IllustrationContainer>
              )}

              <div className="container" style={{ maxWidth: "500px" }}>
                <div className="mb-4">
                  <input
                    name="imgUpload"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="form-control"
                  />
                </div>

                {uploadPreviewPercent * 1 === 0 ? (
                  <div
                    className="d-flex flex-row align-items-center justify-content-center"
                    style={{ width: "100%" }}
                  >
                    <button
                      onClick={() => {
                        dispatch(uploadSessionPreview(file, sessionId));
                      }}
                      className="btn btn-outline-text btn-primary me-3"
                    >
                      Upload Banner
                    </button>
                  </div>
                ) : (
                  <ProgressContainer>
                    <ProgressFill
                      style={{
                        width: `${
                          uploadPreviewPercent
                            ? `${uploadPreviewPercent}%`
                            : "0%"
                        }`,
                      }}
                      className="d-flex flex-row align-items-center py-2"
                    >
                      <ProgressText>
                        {uploadPreviewPercent &&
                        uploadPreviewPercent * 1 > 1.2 ? (
                          `${(uploadPreviewPercent * 1).toFixed(2)}%`
                        ) : (
                          <div className="py-2">
                            <div
                              class="spinner-border text-dark"
                              role="status"
                            ></div>
                          </div>
                        )}
                      </ProgressText>
                    </ProgressFill>
                  </ProgressContainer>
                )}

                <div class="bp3-progress-bar bp3-intent-primary .modifier">
                  <div
                    class="bp3-progress-meter"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>
            </Container>
          </div>
        </>
      </Dialog>
    </>
  );
};

export default EditSession;
