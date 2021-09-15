import React, { useState } from "react";
import styled from "styled-components";
import Chip from "@material-ui/core/Chip";
import Faker from "faker";
// import Logo from "./../../../assets/Logo/Logo_light.svg"
import PauseRoundedIcon from "@material-ui/icons/PauseRounded"; // Pause
import StopRoundedIcon from "@material-ui/icons/StopRounded"; // Stop
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded"; // Resume
import HomeRoundedIcon from "@material-ui/icons/HomeRounded"; // Live Stage
import AlbumRoundedIcon from "@material-ui/icons/AlbumRounded"; // Recording
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded"; // Video Camera Icon
import MicNoneRoundedIcon from "@material-ui/icons/MicNoneRounded"; // Microphone Icon
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded"; // Screen Share Icon
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded"; // Settings rounded Icon
import KeyboardTabRoundedIcon from "@material-ui/icons/KeyboardTabRounded"; // Keyboard tab rounded Icon

import LastPageRoundedIcon from "@material-ui/icons/LastPageRounded";
import FirstPageRoundedIcon from "@material-ui/icons/FirstPageRounded";

import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded"; // Watching group

import AppsRoundedIcon from "@material-ui/icons/AppsRounded";
import ViewCompactRoundedIcon from "@material-ui/icons/ViewCompactRounded";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import { Avatar } from "@material-ui/core";
import MainChatComponent from "../SideDrawerComponents/Chat/MainChatComponent";
import ChatMsgElement from "../SideDrawerComponents/Chat/helper/ChatMsgElement";
import MsgInput from "../SideDrawerComponents/Chat/helper/MsgInput";
import SessionQnAComponent from "../sessionComponents/SubComponents/IndividualComponents/SessionQnAComponent";
import SessionPollsComponent from "../sessionComponents/SubComponents/IndividualComponents/SessionPolls/SessionPollsComponent";
import Poll from "../../Elements/Poll";

const Button = styled.div`
  font-family: "Ubuntu";
  font-weight: 500;
  border: none;
  background-color: #0b4f6c;
  color: #dcc7be;
  padding: 7px 12px;
  width: max-content;
  border-radius: 3px;
  font-size: 0.9rem;
`;

const StageNav = styled.div`
  height: 7vh;
  background-color: #152d35;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;
  align-items: center;
  justify-content: space-between;
`;

const StageBody = styled.div`
  height: 86vh;
  background-color: #345b63;
  width: 100%;

  position: relative;

  display: grid;
  grid-template-columns: 5fr 1.5fr;
  grid-gap: 32px;
`;

const GalleryView = styled.div`
  height: 85vh;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;
  /* justify-content: center; */

  padding: 8vh 3vw;
`;

const StageControl = styled.div`
  height: 7vh;
  background-color: #152d35;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;
  align-items: center;
`;

const BrandLogo = styled.div`
  height: 36px;
  width: 36px;
  background-color: #ffffff;
  border-radius: 5px;
`;

const SessionName = styled.div`
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.82rem;
  color: #ffffff;
`;

const ChipModified = styled.div`
  color: #ffffff;
  background-color: #f05050;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.82rem;
  padding: 5px 15px;
  border-radius: 15px;
`;

const BtnFilled = styled.div`
  background-color: #345b63;
  padding: 5px 8px;

  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 3px;
  color: #dcc7be;
  max-width: fit-content;

  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: #1f545e;
    color: #ffffff;
  }
`;

const BtnOutlined = styled.div`
  padding: 5px 8px;
  background-color: transparent;
  border: 1px solid #345b63;

  color: #dcc7be;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 3px;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PeopleWatching = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  color: #ffffff;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 3px;
`;

const BtnDanger = styled.div`
  background-color: #dd352f;
  padding: 10px 16px;

  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.82rem;
  border-radius: 3px;
  color: #ffffff;
  max-width: fit-content;

  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: #ce2d2d;
    color: #ffffff;
  }
`;

const IconButton = styled.div`
  background-color: #ffffffa9;

  color: #1f545e;
  padding: 7px;
  border-radius: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const VideoStreamContainer = styled.div`
  background-color: #83838383;
  border-radius: 20px;
  height: "180px";
`;

const SessionSideDrawer = styled.div`
  padding: 6px 6px;
  width: 100%;
  height: 100%;
  background-color: #212121;

  background: rgba(220, 225, 225, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  /* border-radius: 10px; */
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const SessionSideIconBtnNav = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;

  padding: 12px 7px;
`;

const TabButton = styled.div`
  font-weight: "Ubuntu";
  font-weight: 500;
  font-size: 0.75rem;

  color: #ffffff;
  background-color: ${(props) => (props.active ? "#152d35" : "#264049")};

  padding: 5px 15px;
  border-radius: 5px;
  text-align: center;
`;
const Divider = styled.div`
  background-color: #ffffff46;
  height: 1px;
  width: 100%;

  padding: 0px 7px;
  margin-bottom: 10px;
`;

const SessionLinkNav = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  

  border-bottom: 1px solid #152d35;
`;

const LinkTab = styled.div`
  font-weight: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;

  color: ${(props) => (props.active ? "#152d35" : "#ffffff")};

  border-bottom: ${(props) => props.active && "1px solid #152d35"};

  padding: 6px 10px;
  text-align: center;

  &:hover {
      color: #152d35;
      /* border-bottom: 1px solid #152d35; */
      cursor: pointer;
  }
`;

const SessionStage = () => {

    const [activeLinkTab, setActiveLinkTab] = useState('chat');

  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState(null);

  const createReplyWidget = (name, img, msg) => {
    setName(name);
    setImage(img);
    setMsg(msg);

    console.log("create reply widget was invoked");
  };

  const destroyReplyWidget = () => {
    setName(null);
    setImage(null);
    setMsg(null);
  };

  return (
    <>
      <div>
        <StageNav className="px-3 py-1">
          <div className="d-flex flex-row align-items-center">
            <BrandLogo className="me-3" />
            <SessionName className="me-3">
              Annual Founder Q&A with community
            </SessionName>
            {/* <Chip label="Live" color="secondary" /> */}
            <ChipModified>Live</ChipModified>
          </div>

          <div className="d-flex flex-row align-items-center justify-content-center">
            <BtnOutlined className="me-3">
              <PauseRoundedIcon className="me-2" style={{ fontSize: "20px" }} />
              Take break
            </BtnOutlined>
            <BtnFilled className="me-3">
              <HomeRoundedIcon className="me-2" style={{ fontSize: "20px" }} />
              Live stage
            </BtnFilled>
            <BtnOutlined>
              <StopRoundedIcon className="me-2" style={{ fontSize: "20px" }} />
              End session
            </BtnOutlined>
          </div>

          <div className="d-flex flex-row align-items-center justify-content-end">
            <BtnOutlined className="me-3">
              <AlbumRoundedIcon className="me-2" style={{ fontSize: "20px" }} />
              Recording
            </BtnOutlined>

            <PeopleWatching className="me-3">
              <PeopleOutlineRoundedIcon className="me-2" />
              2,340 watching
            </PeopleWatching>
            <Avatar
              src={Faker.image.avatar()}
              alt={Faker.name.findName()}
              variant="rounded"
            />
          </div>
          {/* <div>1</div>
          <div>2</div>
          <div>3</div> */}
        </StageNav>

        <StageBody>
          <div>
            <FirstPageRoundedIcon
              style={{
                position: "absolute",
                top: "10px",
                right: "16px",
                color: "#ffffff",
              }}
            />

            <div className="">
              <GalleryView>
                <VideoStreamContainer />
                <VideoStreamContainer />
                <VideoStreamContainer />
                <VideoStreamContainer />
                <VideoStreamContainer />
              </GalleryView>
            </div>
          </div>

          <SessionSideDrawer>
            <SessionSideIconBtnNav>
              <TabButton active>Activity</TabButton>
              <TabButton>Raised hands</TabButton>
              <TabButton>Videos</TabButton>
            </SessionSideIconBtnNav>

            {/* <MainChatComponent /> */}

            <div>
              <Divider />
            </div>

            <SessionLinkNav>
              <LinkTab onClick={() => {
                  setActiveLinkTab("chat")
              }} active={activeLinkTab === "chat" ? true : false}>Chat</LinkTab>
              <LinkTab onClick={() => {
                  setActiveLinkTab("q&a")
              }} active={activeLinkTab === "q&a" ? true : false}>Q&A</LinkTab>
              <LinkTab onClick={() => {
                  setActiveLinkTab("poll")
              }} active={activeLinkTab === "poll" ? true : false}>Poll</LinkTab>
            </SessionLinkNav>
            {(() => {
                switch (activeLinkTab) {
                    case "chat":
                        return (<div className="d-flex flex-column" style={{ height: "100%" }}>
                        <div style={{ height: "69vh" }} className="py-3 px-3">
                          <ChatMsgElement
                            createReplyWidget={createReplyWidget}
                            msgText={"Hi There"}
                            image={Faker.image.avatar()}
                            name={Faker.name.findName()}
                          />
                        </div>
          
                        <div className="px-3">
                          <MsgInput
                            name={name}
                            image={image}
                            msg={msg}
                            destroyReplyWidget={destroyReplyWidget}
                            //  sendChannelMessage={sendChannelMessage}
                          />
                        </div>
                      </div>);
                       case "q&a": 
                       return (<div className="d-flex flex-column" style={{ height: "100%" }}>
                       <div style={{ height: "69vh" }} className="py-3 px-3">
                         <SessionQnAComponent
                           
                         />
                       </div>
         
                       
                     </div>)
                       case "poll": 
                       return (<div className="d-flex flex-column" style={{ height: "100%" }}>
                       <div style={{ height: "69vh" }} className="py-3 px-3">
                         <Poll />
                       </div>
         
                       
                     </div>)
                
                    default:
                        break;
                }
            })()}
            
          </SessionSideDrawer>
          {/* <div className="session-side-drawer"></div> */}
        </StageBody>

        <StageControl className="px-3 py-1">
          <div className="d-flex flex-row align-items-center">
            <BtnDanger className="me-3">Leave</BtnDanger>

            <div className="stage-left-controls d-flex flex-row  align-items-center">
              {/* <div className="room-no-text">Table 1</div> */}
              <IconButton className="me-3">
                <AppsRoundedIcon style={{ fontSize: "20px" }} />
              </IconButton>
              <IconButton className="me-3">
                <ViewCompactRoundedIcon style={{ fontSize: "20px" }} />
              </IconButton>
              <IconButton className="me-3">
                <AccountBoxOutlinedIcon style={{ fontSize: "20px" }} />
              </IconButton>
            </div>
          </div>

          <div className="d-flex flex-row align-items-center justify-content-center">
            <IconButton className="me-4">
              <VideocamRoundedIcon style={{ fontSize: "20px" }} />
            </IconButton>
            <IconButton className="me-4">
              <MicNoneRoundedIcon style={{ fontSize: "20px" }} />
            </IconButton>
            <IconButton className="me-4">
              <ScreenShareRoundedIcon style={{ fontSize: "20px" }} />
            </IconButton>
          </div>

          <div className="d-flex flex-row align-items-center justify-content-end">
            <SettingsRoundedIcon
              style={{ color: "#FFFFFF", fontSize: "20px" }}
            />
          </div>
        </StageControl>
      </div>
      {/* <Button>Styled</Button> */}
    </>
  );
};

export default SessionStage;
