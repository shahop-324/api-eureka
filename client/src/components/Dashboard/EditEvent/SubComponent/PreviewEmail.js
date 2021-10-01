import React from "react";
import styled from "styled-components";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

import Select from "react-select";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import SendTestEmail from "./SendTestEmail";
import EmailConfirmation from "./EmailConfirmation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
};

const Container = styled.div`
  background-color: transparent;
  height: 80vh;
  /* display: grid;
  grid-template-columns: 5fr 1.8fr;
  grid-gap: 24px; */
`;

const TextSmall = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;
  color: #646464;
`;

const TextDescriptive = styled.span`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.86rem;
  color: #494949;
`;

const FormLabel = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.76rem;
  color: #494949;
`;

const MailContainer = styled.div`
  background-color: #ffffff70;
  min-height: 500px;
  min-height: 450px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #d1d1d1;
  max-width: 768px;
`;

const PreviewEmail = ({ open, handleClose }) => {
  const [openSendTestEmail, setOpenSendTestEmail] = React.useState(false);

  const [openEmailConfirmation, setOpenEmailConfirmation] =
    React.useState(false);

  const handleCloseSendTestEmail = () => {
    setOpenSendTestEmail(false);
  };

  const handleCloseEmailConfirmation = () => {
    setOpenEmailConfirmation(false);
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "#538BF7" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <KeyboardBackspaceRoundedIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Mail Preview
            </Typography>
            <button
              onClick={() => {
                setOpenSendTestEmail(true);
              }}
              className="btn btn-light btn-outline-text me-3"
            >
              <span>Send test mail </span>
            </button>
            <button
              onClick={() => {
                setOpenEmailConfirmation(true);
              }}
              className="btn btn-light btn-outline-text"
            >
              <SendRoundedIcon className="me-2" /> <span>Send mail</span>
            </button>
          </Toolbar>
        </AppBar>
        {/* Main Body goes here */}
        <Container className="container mt-4">
          <div className="mb-5">
            <div className="mb-3">
              <TextDescriptive>
                {" "}
                <span className="me-2">To: </span> All registered attendees
              </TextDescriptive>
            </div>
            <div className="mb-3">
              <TextDescriptive>
                <span className="me-2">Email subject: </span> Announcing event
                speakers line up
              </TextDescriptive>
            </div>
            <div className="mb-3">
              <TextDescriptive>
                <span className="me-2"> Pre header: </span> Hi there, we have an
                exciting news for you all.
              </TextDescriptive>
            </div>
          </div>

          <div style={{ maxWidth: "420px" }} className="mb-5">
            <FormLabel className="mb-1">Preview email as</FormLabel>
            <Select
              options={[
                { label: "Speakers", value: "Speakers" },
                { label: "Attendees", value: "Attendees" },
                { label: "Exhibitors", value: "Exhibitors" },
              ]}
              styles={styles}
            />
          </div>

          <MailContainer></MailContainer>
        </Container>
      </Dialog>
      <SendTestEmail
        open={openSendTestEmail}
        handleClose={handleCloseSendTestEmail}
      />
      <EmailConfirmation open={openEmailConfirmation}
        handleClose={handleCloseEmailConfirmation} />
    </>
  );
};

export default PreviewEmail;
