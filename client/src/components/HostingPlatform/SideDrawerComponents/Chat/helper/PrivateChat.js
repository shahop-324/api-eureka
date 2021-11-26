import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { fetchEventRegistrations } from "../../../../../actions";
import PeopleProfile from "../../People/helper/PeopleProfile";
import VideoCallOptions from "../Sub/VideoCallOptions";
import IndividualChat from "./IndividualChat";
import PrivateChatListComponent from "./PrivateChatListComponent";

const PrivateChat = () => {
  const params = useParams();
  const eventId = params.eventId;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [openVideoOptions, setOpenVideoOptions] = useState(false);

  const handleOpenVideoOptions = () => {
    setOpenVideoOptions(true);
  };

  const handleCloseVideoOptions = () => {
    setOpenVideoOptions(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { id } = useSelector((state) => state.personalChat);

  const bool = id ? true : false; // Flag to detect if we have to show personal chat or not

  useEffect(() => {
    dispatch(fetchEventRegistrations(eventId));
  }, []);

  return (
    <>
      {(() => {
        switch (bool) {
          case false:
            return <PrivateChatListComponent />;

          case true:
            return (
              <IndividualChat
                handleOpen={handleOpen}
                handleOpenVideoOptions={handleOpenVideoOptions}
              />
            );

          default:
            return (
              <IndividualChat
                handleOpen={handleOpen}
                handleOpenVideoOptions={handleOpenVideoOptions}
              />
            );
        }
      })()}

      <PeopleProfile open={open} handleClose={handleClose} />
      <VideoCallOptions
        open={openVideoOptions}
        handleClose={handleCloseVideoOptions}
      />
    </>
  );
};

export default PrivateChat;
