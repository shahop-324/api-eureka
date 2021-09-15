import React, { useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import "./../Styles/Settings.scss";
import { Divider, IconButton } from "@material-ui/core";
import CustomizeEvent from "./CustomiseEvent";
import UpdateEventProfile from "./UpdateEventProfile";
import CameraAndMic from "./Camera&Mic";
import NotificationSettings from "./NotificationSettings";

const SettingsDrawer = ({ openDrawer, handleCloseDrawer }) => {

  const [openAudioAndVideo, setOpenAudioAndVideo] = useState(false);

  const [openCustomise, setOpenCustomise] = useState(false);

  const [openNotificationSettings, setOpenNotificationSettings] = useState(false);

  const [openUpdateProfile, setOpenUpdateProfile] = useState(false);

  const handleOpenAudioAndVideo = () => {
    setOpenAudioAndVideo(true);
  }

  const handleOpenNotificationSettings = () => {
    setOpenNotificationSettings(true);
  }

  const handleCloseNotificationSettings = () => {
    setOpenNotificationSettings(false);
  }

  const handleCloseAudioAndVideo = () => {
    setOpenAudioAndVideo(false);
  }

  const handleOpenUpdateProfile = () => {
    setOpenUpdateProfile(true);
  }

  const handleCloseUpdateProfile = () => {
    setOpenUpdateProfile(false);
  }


  const handleOpenCustomise = () => {
    setOpenCustomise(true);
  }

  const handleCloseCustomise = () => {
    setOpenCustomise(false);
  }

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <div className="hosting-platform-settings px-4 py-4">
            <div className="d-flex flex-row align-items-center justify-content-between">
              <div className="event-platform-side-drawer-heading">Settings</div>

              <IconButton
                onClick={() => {
                  handleCloseDrawer();
                }}
              >
                <CancelRoundedIcon />
              </IconButton>
            </div>

            <div className="my-3">
              <Divider />
            </div>

            <div onClick={() => {
              handleOpenCustomise()
            }} className="setting-tab px-3 py-2 mb-4 d-flex flex-row align-items-center justify-content-between">
              <div>
                <div className="setting-tab-text mb-1">Customize event</div>
                <div className="setting-tab-sub-text">
                  Fully customize your event experience
                </div>
              </div>
              <IconButton>
                <ArrowForwardIosRoundedIcon className="icon-btn" />
              </IconButton>
            </div>
            <div onClick={() => {
              handleOpenUpdateProfile()
            }} className="setting-tab px-3 py-2 mb-4 d-flex flex-row align-items-center justify-content-between">
              <div>
                <div className="setting-tab-text mb-1">Update profile</div>
                <div className="setting-tab-sub-text">
                  Update your profile info that is visible to others
                </div>
              </div>

              <IconButton>
                <ArrowForwardIosRoundedIcon className="icon-btn" />
              </IconButton>
            </div>
            <div onClick={() => {
              handleOpenAudioAndVideo();
            }} className="setting-tab px-3 py-2 mb-4 d-flex flex-row align-items-center justify-content-between">
              <div>
                <div className="setting-tab-text mb-1">
                  Audio and Video settings
                </div>
                <div className="setting-tab-sub-text">
                  Test and update your camera and mic preferences
                </div>
              </div>

              <IconButton>
                <ArrowForwardIosRoundedIcon className="icon-btn" />
              </IconButton>
            </div>
            <div onClick={() => {
              handleOpenNotificationSettings();
            }} className="setting-tab px-3 py-2 mb-4 d-flex flex-row align-items-center justify-content-between">
              <div>
                <div className="setting-tab-text mb-1">Notification Settings</div>
                <div className="setting-tab-sub-text">
                  Enable/disable notification popups and sound
                </div>
              </div>

              <IconButton>
                <ArrowForwardIosRoundedIcon className="icon-btn" />
              </IconButton>
            </div>
            {/* <div className="setting-tab px-3 py-2 mb-4 d-flex flex-row align-items-center justify-content-between">
              <div>
                <div className="setting-tab-text mb-1">
                  Security & Privacy
                </div>
                <div className="setting-tab-sub-text">
                  Manage your profile visbility & block <br/> list for a  better experience
                </div>
              </div>

              <IconButton>
                <ArrowForwardIosRoundedIcon className="icon-btn" />
              </IconButton>
            </div> */}
            <div className="setting-tab px-3 py-2 mb-4 d-flex flex-row align-items-center justify-content-between">
              <div>
                <div className="setting-tab-text mb-1">User dashboard</div>
                <div className="setting-tab-sub-text">
                  Switch to your user account
                </div>
              </div>

              <IconButton>
                <ArrowForwardIosRoundedIcon className="icon-btn" />
              </IconButton>
            </div>
            <div className="setting-tab px-3 py-2 mb-4 d-flex flex-row align-items-center justify-content-between">
              <div>
                <div className="setting-tab-text mb-1">Community dashboard</div>
                <div className="setting-tab-sub-text">
                  Switch to any of your community dashboard
                </div>
              </div>

              <IconButton>
                <ArrowForwardIosRoundedIcon className="icon-btn" />
              </IconButton>
            </div>

            <div>
              <button
                className="btn btn-outline-danger btn-outline-text"
                style={{ width: "100%" }}
              >
                Logout
              </button>
            </div>
          </div>
        </SwipeableDrawer>
        {/* </Drawer> */}
      </React.Fragment>

      <CustomizeEvent openDrawer={openCustomise} handleCloseDrawer={handleCloseCustomise} />
      <NotificationSettings openDrawer={openNotificationSettings} handleCloseDrawer={handleCloseNotificationSettings} />
      <UpdateEventProfile openDrawer={openUpdateProfile} handleCloseDrawer={handleCloseUpdateProfile}/>
      <CameraAndMic open={openAudioAndVideo} handleClose={handleCloseAudioAndVideo}/>
    </>
  );
};

export default SettingsDrawer;
