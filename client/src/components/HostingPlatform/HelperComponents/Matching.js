/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Avatar, Dialog } from "@material-ui/core";
import Faker from "faker";

import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { fetchAvailableForNetworking } from "../../../actions";
import NetworkingPrivateRoom from "./NetworkingPrivateRoom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

const Matching = ({ openMatching, handleCloseMatching }) => {
  const dispatch = useDispatch();

  const [openPrivateNetworkingRoom, setOpenPrivateNetworkingRoom] =
    useState(false);

  const handleClosePrivateRoom = () => {
    setOpenPrivateNetworkingRoom(false);
  };

  const params = useParams();

  const eventId = params.eventId;

  const [img, setImg] = useState("");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { image, id, firstName, lastName } = useSelector(
    (state) => state.user.userDetails
  );

  const classes = useStyles();

  useEffect(() => {
    // Fetch list of all people in this event who are currently available for networking
    dispatch(fetchAvailableForNetworking(eventId, id));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImg(Faker.image.avatar());
    }, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={openMatching}
        aria-labelledby="responsive-dialog-title"
        style={{ minHeight: "550px", marginLeft: "4vw" }}
      >
        <div className="speed-networking-matching-container p-4 pt-5">
          <div className="finding-your-match mb-5">
            Finding your best match...
          </div>
          <div className="matching-card d-flex flex-row align-items-center justify-content-center mb-4">
            <Avatar
              src={img}
              className={`${classes.large} slider-avatar-matching`}
            />
          </div>
          <div>
            <div
              className="btn-filled-h  py-3 start-networking-btn "
              style={{
                maxWidth: "100px",
                textAlign: "center",
                margin: "0 auto",
                backgroundColor: "#F7536E",
              }}
              onClick={() => {
                console.log("Cancel speed networking was just clicked!");
                handleCloseMatching();
                setOpenPrivateNetworkingRoom(true);

                // TODO   Emit a message to put this user in available for networking and cancel matching him/her.
              }}
            >
              Stop
            </div>
          </div>
        </div>
      </Dialog>
      <NetworkingPrivateRoom
        openPrivateRoom={openPrivateNetworkingRoom}
        handleClosePrivateRoom={handleClosePrivateRoom}
      />
    </>
  );
};
export default Matching;
