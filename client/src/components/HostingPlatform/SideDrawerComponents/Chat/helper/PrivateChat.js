import React, { useState } from "react";
import PeopleProfile from "../../People/helper/PeopleProfile";
import VideoCallOptions from "../Sub/VideoCallOptions";
import IndividualChat from "./IndividualChat";
import PrivateChatListComponent from "./PrivateChatListComponent";

const PrivateChat = () => {

    const [open, setOpen] = useState(false);

    const [openVideoOptions, setOpenVideoOptions] = useState(false);

    const handleOpenVideoOptions = () => {
        setOpenVideoOptions(true);
    }

    const handleCloseVideoOptions = () => {
        setOpenVideoOptions(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

  const [selectedPerson, setSelectedPerson] = useState("empty");

  const enterPersonalChat = (id) => {
    setSelectedPerson("some id");
  };

  const exitPersonalChat = () => {
    setSelectedPerson("empty");
  };

  return (
    <>

      {(() => {
        switch (selectedPerson) {
          case "empty":
            return <PrivateChatListComponent enterPersonalChat={enterPersonalChat}/> ;

          default:
            return <IndividualChat exitPersonalChat={exitPersonalChat} handleOpen={handleOpen} handleOpenVideoOptions={handleOpenVideoOptions}/>;
        }
      })()}

<PeopleProfile open={open} handleClose={handleClose}/>

<VideoCallOptions open={openVideoOptions} handleClose={handleCloseVideoOptions}/>

    </>
  );
};

export default PrivateChat;
