import { Avatar, Dialog } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Faker from "faker";
// import FloatingAvatars from "../HelperComponents/NetworkingFloatingAvatars";
import "./../Styles/networking.scss";
import { useSelector } from "react-redux";
import socket from "./../service/socket";

import { makeStyles } from "@material-ui/core/styles";
import AOS from "aos";
import "aos/dist/aos.css";
import { useParams } from "react-router-dom";

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

const Networking = () => {
  const classes = useStyles();

  const params = useParams();

  const eventId = params.eventId;

  const [open, setOpen] = useState(false);

  const [img, setImg] = useState("");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { image, id, firstName, lastName } = useSelector(
    (state) => state.user.userDetails
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      /*
          Run any function or setState here
      */
      setImg(Faker.image.avatar());
    }, 1500);

    socket.emit("joinNetworking", { eventId: eventId, userId: id }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      clearInterval(intervalId);
      socket.emit(
        "leaveNetworking",
        { eventId: eventId, userId: id },
        (error) => {
          if (error) {
            alert(error);
          }
        }
      );
    };

    // Emit a signal to join network zone when mounting this component and automatically.
  }, []);

  useEffect(() => {
    return () => {
      // Emit a signal to leave from networking zone. When unmounting this component.
    };
  }, []);

  // ! PLACE USER IN AVAILABLE FOR NETWORKING LIST ONLY WHEN HE OR SHE CLICKS ON START SPEED NETWORKING

  return (
    <>
      <div className="sessions-and-networking-body-heading mb-5">
        Start Connecting the dots
      </div>
      {/* <FloatingAvatars /> */}
      <div>
        <div>
          <div class="sonar-wrapper">
            <div class="sonar-emitter" style={{ position: "relative" }}>
              <Avatar
                src={
                  image.startsWith("https")
                    ? image
                    : `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${image}`
                }
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  height: "9rem",
                  width: "9rem",
                  border: "2px solid #538BF7",
                }}
              />
              <div class="sonar-wave"></div>
              <div class="sonar-wave"></div>
              <div class="sonar-wave"></div>
              <div class="sonar-wave"></div>
              <div class="sonar-wave"></div>
              <div class="sonar-wave"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-row justify-content-center networking-options-btn">
        <div
          className="btn-filled-h px-5 py-3 start-networking-btn"
          onClick={() => {
            console.log("speed networking was just clicked!");
            socket.emit("startNetworking", {
              eventId,
              userId: id,
              userName: firstName + " " + lastName,
              image,
              socketId: socket.id,
            });
            setOpen(true);
            // TODO   Emit a message to put this user in available for networking and start matching him/her to others who are also avialable.
          }}
        >
          Start Speed Networking
        </div>
      </div>

      <Dialog
        fullScreen={fullScreen}
        open={open}
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
                setOpen(false);

                // TODO   Emit a message to put this user in available for networking and cancel matching him/her.
              }}
            >
              Stop
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Networking;
