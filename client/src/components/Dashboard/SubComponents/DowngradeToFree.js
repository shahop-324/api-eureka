import React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";
import AppSumo from "./../../../assets/images/clip-unsubscribed.svg";

import dateFormat from "dateformat";
import { useSelector } from "react-redux";

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
  font-size: 0.86rem;
  color: #494949;
`;

const Image = styled.img`
  height: 360px;
  width: auto;
  object-fit: contain;
  border-radius: 10px;
`;

const DowngradeToFree = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { communityDetails } = useSelector((state) => state.community);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="" style={{ width: "520px" }}>
          <HeaderFooter className="p-3">
            <Heading className="">Downgrade & Lose Benefits</Heading>
          </HeaderFooter>

          <DialogContent
            className="pt-4 d-flex flex-column align-items-center"
            style={{}}
          >
            {/* Here write main content */}

            <Image className="mb-4" src={AppSumo} />

            <div className="mb-3">
              <FormLabel className="mb-2">
                You will lose all of your access to premium features from
                starting of next Billing cycle on{" "}
                {dateFormat(
                  communityDetails.planExpiresAt,
                  "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}
                . Are you sure to proceed ?
              </FormLabel>
            </div>
          </DialogContent>
          <div className="d-flex flex-row align-items-center justify-content-end px-4 pb-4">
            <button
              onClick={() => {
                handleClose();
              }}
              className="btn btn-outline-text btn-outline-dark me-3"
            >
              Cancel
            </button>
            <button className="btn btn-outline-text btn-danger">Proceed</button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DowngradeToFree;
