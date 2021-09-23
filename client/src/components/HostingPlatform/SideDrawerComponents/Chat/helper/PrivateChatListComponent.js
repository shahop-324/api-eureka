import React, { useState } from "react";
import "./../../../Styles/PeopleList.scss";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import PeopleList from "./PeopleList";
import { Avatar } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import Faker from "faker";
import PeopleProfile from "../../People/helper/PeopleProfile";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  medium: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const IndividualChatSummary = ({ open, handleClose, enterPersonalChat }) => {
  const classes = useStyles();
  return (
    <>
      <div
        className="mb-4 chat-summary py-2"
        onClick={() => {
          enterPersonalChat();
        }}
      >
        <div className="individual-chat-summary-container mb-2 px-3 ">
          <Avatar
            src={Faker.image.avatar()}
            alt={Faker.name.findName()}
            className={classes.large}
            variant="rounded"
          />

          <div className="">
            <div
              className="chat-box-name"
              style={{ textTransform: "capitalize", fontFamily: "Ubuntu" }}
            >
              {Faker.name.findName()}
            </div>
            <div
              style={{
                fontWeight: "500",
                color: "#4B4B4B",
                fontSize: "0.75rem",
              }}
            >
              Product Manager, Evenz
            </div>
          </div>

          <div style={{ justifySelf: "end" }}>
            <Badge
              badgeContent={3}
              color="primary"
              // style={{ fill: "#538BF7" }}
            ></Badge>
          </div>
        </div>

        <div className="chat-summary-msg-container px-3">
          <div></div>

          <div
            className="chat-box-name"
            style={{
              textTransform: "capitalize",
              fontFamily: "Ubuntu",
              fontWeight: "500",
              color: "#616161",
            }}
          >
            {"Hi there, there is a message"}
          </div>
        </div>
      </div>

      <PeopleProfile />
    </>
  );
};

const PrivateChatListComponent = ({ open, handleClose, enterPersonalChat }) => {
  const [openPeopleList, setOpenPeopleList] = useState(false);

  const handleClosePeopleList = () => {
    setOpenPeopleList(false);
  };

  const classes = useStyles();
  return (
    <>
      <div className="chat-msg-container pt-2 px-2 d-flex flex-column justify-content-between">
        <div>
          <div className="ui icon input mb-3" style={{ width: "100%" }}>
            <input
              type="text"
              placeholder="Search people..."
              className="form-control"
            />
            <i className="search icon"></i>
          </div>

          <div className="individual-chat-summary-list">
            <IndividualChatSummary
              open={open}
              handleClose={handleClose}
              enterPersonalChat={enterPersonalChat}
            />
            <IndividualChatSummary
              open={open}
              handleClose={handleClose}
              enterPersonalChat={enterPersonalChat}
            />
            <IndividualChatSummary
              open={open}
              handleClose={handleClose}
              enterPersonalChat={enterPersonalChat}
            />
            <IndividualChatSummary
              open={open}
              handleClose={handleClose}
              enterPersonalChat={enterPersonalChat}
            />
          </div>
        </div>
        <div
          className={classes.root}
          style={{ textAlign: "end" }}
          onClick={() => {
            setOpenPeopleList(true);
          }}
        >
          <Fab
            color="primary"
            aria-label="add"
            style={{ backgroundColor: "#538BF7" }}
          >
            <AddIcon />
          </Fab>
        </div>
      </div>

      <PeopleList open={openPeopleList} handleClose={handleClosePeopleList} />
    </>
  );
};

export default PrivateChatListComponent;
