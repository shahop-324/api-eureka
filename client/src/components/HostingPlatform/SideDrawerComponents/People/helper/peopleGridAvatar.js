import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import "./../../../Styles/root.scss";

// import "semantic-ui-css/semantic.min.css";

import { Popup } from "semantic-ui-react";

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
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const PeopleGridAvatar = ({
  image,
  name,
  designation,
  organisation,
  city,
  country,
}) => {
  console.log(name);
  const [display, setDisplay] = useState("none");
  const [cursor, setCursor] = useState("auto");

  const classes = useStyles();

  return (
    <>
      <div
        onMouseEnter={() => {
          setDisplay("block");
          setCursor("pointer");
        }}
        onMouseLeave={() => {
          setDisplay("none");
          setCursor("auto");
        }}
      >
        <Popup
          trigger={
            <div style={{ position: "relative" }}>
              <Avatar
                alt={name}
                src={image}
                variant="rounded"
                className={classes.large}
              />
              <div
                className="p-3"
                style={{
                  backgroundColor: "#ffffff",
                  display: display,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  cursor: cursor,
                }}
              >
                <ChatIcon style={{ fill: "#000000" }} />
              </div>
            </div>
          }
          position="bottom left"
        >
          <Popup.Content>

          <div>
            <div className="d-flex flex-row align-items-center">
              <Avatar
                alt={name}
                src={image}
                variant="rounded"
                className={classes.large}
              />
              <div className="ms-3">
                <div className="btn-outline-text" style={{ fontSize: "14px" }}>
                  {name}
                </div>
                <div className="people-headline">
                  {designation} at {organisation}
                </div>
                <div className="people-location">
                  {city}, {country}
                </div>
              </div>
            </div>
          </div>
          </Popup.Content>
        </Popup>
      </div>
    </>
  );
};

export default PeopleGridAvatar;
