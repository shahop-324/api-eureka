import React from "react";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { unlinkVideo } from "./../../../../actions";

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const FormHeading = styled.div`
  font-size: 1.1rem;
  font-family: "Ubuntu";
  font-weight: 500;
  color: #212121;
`;

const UnlinkVideo = ({ id, eventId, open, handleClose }) => {
  const params = useParams;
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <HeaderFooter className="px-4 py-3 mb-3">
          <FormHeading>Unlink this video</FormHeading>
        </HeaderFooter>
        <DialogContent>
          <DialogContentText>
            You are about to unlink this video from library. By doing so, this
            video won't be available for streaming in any sessions. But the one
            already streaming this one will have to pause and restart for
            changes to take effect.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-outline-dark btn-outline-text me-3"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-outline-text btn-primary"
            onClick={() => {
              dispatch(unlinkVideo(id, eventId, handleClose));
            }}
          >
            Proceed
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UnlinkVideo;
