import React from "react";
import { Avatar } from "@material-ui/core";
import "./../../../Styles/root.scss";
import "./../../../Styles/chatComponent.scss";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

import { useParams } from "react-router";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

const ReportedMsg = ({
  name,
  image,
  msgText,
  organisation,
  designation,
  timestamp,
}) => {
  console.log(name,
    image,
    msgText,
    organisation,
    designation,
    timestamp,)
  return (
    <>
      <div className="chat-msg-element py-2">
        <div style={{ position: "relative" }}>
          <div
            className=" mb-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 6fr" }}
          >
            <Avatar src={image} alt={name} variant="rounded" />
            <div
              className="chat-box-name ms-3"
              style={{ textTransform: "capitalize", fontFamily: "Ubuntu" }}
            >
              <div>{name}</div>

              <div
                style={{
                  fontWeight: "500",
                  color: "#4B4B4B",
                  fontSize: "0.7rem",
                }}
                className="d-flex flex-row align-items-center justify-content-between"
              >
                <div>
                  {designation} {organisation}
                </div>

                {/* <div>{timeAgo.format(timestamp, "round")}</div> */}
              </div>
            </div>
          </div>
        </div>

        <div
          className=" mb-2"
          style={{ display: "grid", gridTemplateColumns: "1fr 6fr" }}
        >
          <div></div>
          <div style={{ position: "relative" }}>
            <div
              className="chat-msg-text ms-3 p-3"
              style={{ borderTopLeftRadius: "0" }}
            >
              <div>{msgText}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportedMsg;
