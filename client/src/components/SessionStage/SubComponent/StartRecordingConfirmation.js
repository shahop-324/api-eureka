import React, { useEffect } from "react";
import socket from "./../../HostingPlatform/service/socket";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { startSessionRecording } from "./../../../actions";
import { useParams } from "react-router";

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const FormHeading = styled.div`
  font-size: 1.1rem;
  font-family: "Ubuntu";
  font-weight: 500;
  color: #212121;
`;

const StartSessionRecording = ({ open, handleClose, handleStartRecording, setState }) => {
  const dispatch = useDispatch();

  const {eventDetails} = useSelector((state) => state.event);

  const params = useParams();
  const sessionId = params.sessionId;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // useEffect(() => {
  //   socket.on("recordingStarted", ({ session }) => {
  //     handleClose();
  //   });
  // }, []);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <HeaderFooter className="px-4 py-3">
          <FormHeading>Start recording session</FormHeading>
        </HeaderFooter>
        <DialogContent>
          <DialogContentText style={{fontSize: "0.85rem"}}>
            This will start recording session. Are you sure to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-outline-dark btn-outline-text me-3"
            onClick={() =>{
              setState(false);
              handleClose();
            }}
          >
            Cancel
          </button>
          <button
          style={{border: `1px solid ${eventDetails.color}`, backgroundColor: eventDetails.color}}
            className="btn btn-outline-text btn-primary"
            onClick={() => {
              socket.emit("startCloudRecording", { sessionId }, (error) => {
                alert(error);
              });
              handleClose();
              //  dispatch(startSessionRecording(sessionId, handleClose))
            }}
          >
            Proceed
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StartSessionRecording;
