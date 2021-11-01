import React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";
import MailSent from "./../Images/MailSent.png";
import { useDispatch, useSelector } from "react-redux";
import { setOpenCommunityVerificationNotice, resendCommunityVerificationMail } from "./../../../actions";

const Heading = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  font-family: "Ubuntu";
  color: #212121;
`;

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const Image = styled.img`
  height: 360px;
  width: auto;
  object-fit: contain;
  border-radius: 10px;
`;

const FormLabel = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.86rem;
  color: #494949;
`;

const ConfirmCommunityMail = ({ open }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { communityVerificationEmail, communityVerificationId } = useSelector((state) => state.user);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="" style={{ width: "520px" }}>
          <HeaderFooter className="p-3">
            <Heading className="">Confirm community email</Heading>
          </HeaderFooter>

          <DialogContent className="pt-4 d-flex flex-column align-items-center">
            <Image className="mb-4" src={MailSent} />

            <div className="mb-3">
              <FormLabel className="mb-2">
                <span>
                  Please check your mail{" "}
                  <span>
                    {" "}
                    <strong>{communityVerificationEmail}</strong>{" "}
                  </span>{" "}
                  and click on the verify button to verify your new community.
                </span>
              </FormLabel>
            </div>
          </DialogContent>

          <div className="d-flex flex-row align-items-center justify-content-end px-4 pb-4">
            <button
              onClick={() => {
                dispatch(resendCommunityVerificationMail(communityVerificationId));
                // dispatch(setOpenCommunityVerificationNotice(false));
              }}
              className="btn btn-outline-text btn-primary me-3"
            >
              Resend mail
            </button>
            <button
              onClick={() => {
                dispatch(setOpenCommunityVerificationNotice(false));
              }}
              className="btn btn-outline-text btn-outline-dark"
            >
              Okay
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ConfirmCommunityMail;
