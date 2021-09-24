import React, { useState } from "react";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { IconButton } from "@material-ui/core";
import IntercomIntegrationPNG from "./../../../../assets/images/int-2.png";
import { useDispatch, useSelector } from "react-redux";
import { editCommunity } from "../../../../actions";
import { useParams } from "react-router";

const TawkDirectChatLink = ({ openDrawer, handleCloseDrawer }) => {

  const { communityDetails } = useSelector((state) => state.community);

  const TawkLink = communityDetails.tawkLink;

  const params = useParams();

  const communityId = params.id;

  const dispatch = useDispatch();

  const [directChatLink, setDirectChatLink] = useState(TawkLink);

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          onOpen={() => {
            console.log("Side nav was opended")
          }}
          onClose={() => {
            console.log("Side nav was closed")
          }}
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <div className="integration-side-drawer-form px-4 py-4">
            <div>
              <IconButton>
                <HighlightOffRoundedIcon
                  onClick={() => {
                    handleCloseDrawer();
                  }}
                />
              </IconButton>
            </div>
            <div style={{ textAlign: "center" }} className="mb-4">
              <img
                style={{ maxHeight: "420px" }}
                src={IntercomIntegrationPNG}
                alt="integration illustration"
              />
            </div>
            <div>
              <div className="mb-3">
                <label
                  Forhtml="eventStartDate"
                  className="form-label form-label-customized"
                >
                  Direct Chat Link
                </label>

                <input
                  type="text"
                  className="me-3 form-control"
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setDirectChatLink(e.target.value);
                  }}
                  value={directChatLink}
                  id="email-group-name"
                  aria-describedby="emailGroupName"
                  placeholder="Tawk direct chat link"
                />
              </div>
              <div className="d-flex flex-row align-items-center justify-content-end mb-4">
                <button onClick={() => {
                  if (!directChatLink) return;
                  dispatch(editCommunity(communityId, {tawkLink: directChatLink}))
                }} className="btn btn-outline-primary btn-outline-text">
                  Connect
                </button>
              </div>

              <div>
                <div className="want-help-heading mb-3">Want help ?</div>
                <div className="integration-guide-btn px-4 py-2">
                  Guid to Integrate Tawk.to with Evenz.
                </div>
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default TawkDirectChatLink;
