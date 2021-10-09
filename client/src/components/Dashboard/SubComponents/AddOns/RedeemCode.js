import React from "react";
import styled from "styled-components";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DialogContent from "@material-ui/core/DialogContent";
import AppSumo from "./../../../../assets/images/clip-1.svg";

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

const RedeemCode = ({ open, handleClose }) => {
  const [tags, setTags] = React.useState([]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="" style={{ width: "520px" }}>
          <HeaderFooter className="p-3">
            <Heading className="">Redeem AppSumo code</Heading>
          </HeaderFooter>

          <DialogContent
            className="pt-4 d-flex flex-column align-items-center"
            style={{}}
          >
            {/* Here write main content */}

            <Image className="mb-4" src={AppSumo} />

            <div className="mb-3">
              <FormLabel className="mb-2">
                You are just a step away from enjoying lifetime benefits.
              </FormLabel>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <FormLabel
                for="tags"
                className="form-label form-label-customized"
              >
                Enter codes 
              </FormLabel>
              <div className="form-group">
                <ReactTagInput
                  tags={tags}
                  placeholder="Type code and press enter. You can stack codes."
                  maxTags={6}
                  editable={true}
                  readOnly={false}
                  removeOnBackspace={true}
                  onChange={(newTags) => {
                    setTags(newTags);
                  }}
                />
              </div>
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
            <button className="btn btn-outline-text btn-primary">
              Apply codes
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default RedeemCode;
