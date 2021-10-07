import React from "react";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { deleteVibe } from "../../../actions";

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const FormHeading = styled.div`
  font-size: 1.1rem;
  font-family: "Ubuntu";
  font-weight: 500;
  color: #212121;
`;

const DeleteStageVibe = ({ open, handleClose, vibeId }) => {
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
          <FormHeading>Delete this stage vibe.</FormHeading>
        </HeaderFooter>

        <DialogContent>
          <DialogContentText>
            You are about to delete this stage vibe from library. By doing so, this
            vibe won't be available in any sessions. But
            the one already using this one will have to pause and
            restart for changes to take effect.
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
              //   dispatch(deleteCoupon(id));
              dispatch(deleteVibe(vibeId));
              handleClose();
            }}
          >
            Proceed
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteStageVibe;
