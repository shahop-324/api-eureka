import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import styled from "styled-components";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

const ShowKeysBody = styled.div`
  background-color: #fff;
  min-height: 300px;
  min-width: 420px;
`;

const ShowKeys = ({ open, handleClose, APIKey, APISecret }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <ShowKeysBody className="px-4 pb-3 pt-2">
          <div className="d-flex flex-row align-items-center justify-content-end mb-4">
            <IconButton onClick={handleClose}>
              <CancelRoundedIcon />
            </IconButton>
          </div>
          <label
            Forhtml="eventEndDate"
            className="form-label form-label-customized"
          >
            API key
          </label>
          <div
            className="referral-link-and-copy-to-clipboard mb-4"
            style={{ textAlign: "center" }}
          >
            <div className="ui action input" style={{ minWidth: "400px" }}>
              <input
                type="text"
                value={APIKey}
                readOnly
                placeholder="Search..."
              />
              <button
                className="ui icon button"
                onClick={() => {
                  navigator.clipboard.writeText(APIKey);
                  alert("copied to clipboard!");
                }}
              >
                <i className="copy outline icon"></i>
              </button>
            </div>
          </div>

          <label
            Forhtml="eventEndDate"
            className="form-label form-label-customized"
          >
            API secret
          </label>
          <div
            className="referral-link-and-copy-to-clipboard"
            style={{ textAlign: "center" }}
          >
            <div className="ui action input" style={{ minWidth: "400px" }}>
              <input
                type="text"
                value={APISecret}
                readOnly
                placeholder="Search..."
              />
              <button
                className="ui icon button"
                onClick={() => {
                  navigator.clipboard.writeText(APISecret);
                  alert("copied to clipboard!");
                }}
              >
                <i className="copy outline icon"></i>
              </button>
            </div>
          </div>
        </ShowKeysBody>
      </Dialog>
    </>
  );
};

export default ShowKeys;
