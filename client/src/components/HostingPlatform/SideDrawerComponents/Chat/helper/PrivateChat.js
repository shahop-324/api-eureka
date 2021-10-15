import React, { useState } from "react";
import { useSelector } from "react-redux";
import PeopleProfile from "../../People/helper/PeopleProfile";
import VideoCallOptions from "../Sub/VideoCallOptions";
import IndividualChat from "./IndividualChat";
import PrivateChatListComponent from "./PrivateChatListComponent";

const PrivateChat = () => {
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

  const [selectedPerson, setSelectedPerson] = useState("empty");

  const {id} = useSelector((state) => state.personalChat);

  const enterPersonalChat = (id) => {
    setSelectedPerson("some id");
    // Set some persons id in global redux store along with tag [person || Speaker || Exhibitor]
  };

  const exitPersonalChat = () => {
    setSelectedPerson("empty");
  };

  const bool = id ? true : false; // Flag to detect if we have to show personal chat or not

  return (
    <>
      {(() => {
        switch (bool) {
          case false:
            return (
              <PrivateChatListComponent enterPersonalChat={enterPersonalChat} />
            );

            case true: 
            return (
              <IndividualChat
                exitPersonalChat={exitPersonalChat}
                handleOpen={handleOpen}
                handleOpenVideoOptions={handleOpenVideoOptions}
              />
            );

          default:
            return (
              <IndividualChat
                exitPersonalChat={exitPersonalChat}
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
