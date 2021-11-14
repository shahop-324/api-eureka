import React, { useState } from "react";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import validator from "validator";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { IconButton } from "@material-ui/core";
import { sendTestMail, showSnackbar } from "./../../../../actions";

import Select from "react-select";

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
};

const Heading = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  font-family: "Ubuntu";
  color: #212121;
`;

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const FormLabel = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.76rem;
  color: #494949;
`;

const SendTestEmail = ({ open, handleClose, mailId }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [recepient, setRecepient] = useState(null);
  const dispatch = useDispatch();

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="" style={{ width: "520px" }}>
          <HeaderFooter className="p-3">
            <Heading className="">Send Test Email</Heading>
          </HeaderFooter>

          <DialogContent className="py-4">
            {/* Here write main content */}
            <div className="">
              <FormLabel className="mb-2">Send email to</FormLabel>
              <input
                type="email"
                value={recepient}
                onChange={(e) => {
                  setRecepient(e.target.value);
                }}
                placeholder="Enter email here to receive test email"
                className="form-control"
              ></input>
            </div>
          </DialogContent>
          <HeaderFooter className="p-3">
            <DialogActions>
              <button
                className="btn btn-outline-dark btn-outline-text me-3"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (validator.isEmail(recepient)) {
                    dispatch(sendTestMail(mailId, recepient, handleClose));
                  } else {
                    dispatch(
                      showSnackbar(
                        "warning",
                        "Please enter a valid email address"
                      )
                    );
                  }
                }}
                className="btn btn-primary btn-outline-text"
              >
                Send Test Mail
              </button>
            </DialogActions>
          </HeaderFooter>
        </div>
      </Dialog>
    </>
  );
};

export default SendTestEmail;
