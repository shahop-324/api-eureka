import React from "react";
import {
  Dialog,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {showSnackbar} from "./../../../actions";

const EventLinkInput = styled.input`
  font-weight: 500;
  font-size: 0.8rem;
  font-family: "Ubuntu";
  color: #212121;
`;

const Paper = styled.div`
  width: 480px;
`;

const FormLabel = styled.label`
  font-family: "Ubuntu" !important;
  font-size: 0.82rem !important;
  font-weight: 500 !important;
  color: #5F5F5F !important;
`;

const CodePaper = styled.div`
  background-color: #ffffff;
  padding: 22px;

  background: rgba(255, 255, 255, 0.25);
  /* box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); */
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Heading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #212121;
`;
const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const ShowKeys = ({ open, handleClose, APIKey, APISecret }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [maxWidth, setMaxWidth] = React.useState("lg");

  return (
    <>
      <Dialog
        maxWidth={maxWidth}
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <Paper>
          <HeaderFooter className="px-4 py-3">
            <Heading> API credentials </Heading>
          </HeaderFooter>
          <div className="px-4 py-3">
            <CodePaper>
            <FormLabel
              className="form-label form-label-customized"
            >
             Api key
            </FormLabel>
            <div
                  className="ui action input mb-4"
                  style={{ minWidth: "380px", marginLeft: "auto", marginRight: "auto" }}
                >
                  <EventLinkInput
                    className="event-sharable-link"
                    type="text"
                    value={APIKey}
                    readOnly
                    placeholder="Search..."
                  />
                  <button
                    className="ui icon button"
                    onClick={() => {
                      navigator.clipboard.writeText(APIKey).then(function() {
                        console.log('Async: Copying to clipboard was successful!');
                        dispatch(showSnackbar("success", "Api key copied to clipboard!"));
                      }, function(err) {
                        console.error('Async: Could not copy text: ', err);
                        dispatch(showSnackbar("error", "Failed to copy to clipboard!"));
                      });      
                    }}
                  >
                    <i className="copy outline icon"></i>
                  </button>
                </div>
                <FormLabel
              
              className="form-label form-label-customized"
            >
              Api secret
            </FormLabel>
            <div
                  className="ui action input"
                  style={{ minWidth: "380px", marginLeft: "auto", marginRight: "auto" }}
                >
                  <EventLinkInput
                    className="event-sharable-link"
                    type="text"
                    value={APISecret}
                    readOnly
                    placeholder="Search..."
                  />
                  <button
                    className="ui icon button"
                    onClick={() => {
                      navigator.clipboard.writeText(APISecret).then(function() {
                        console.log('Async: Copying to clipboard was successful!');
                        dispatch(showSnackbar("success", "Api secret copied to clipboard!"));
                      }, function(err) {
                        console.error('Async: Could not copy text: ', err);
                        dispatch(showSnackbar("error", "Failed to copy to clipboard!"));
                      });
    
                      
                    }}
                  >
                    <i className="copy outline icon"></i>
                  </button>
                </div>


            </CodePaper>
          </div>
          <HeaderFooter className="px-4 py-3 d-flex flex-row align-items-center justify-content-end">
            <button
              className="btn btn-outline-dark btn-outline-text"
              onClick={handleClose}
            >
              Cancel
            </button>
            
          </HeaderFooter>
        </Paper>
      </Dialog>
    </>
  );
};

export default ShowKeys;

