import React, { useRef } from "react";
import styled from "styled-components";
import template from "./../../../../design.json";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import EmailEditor from "react-email-editor";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import "./../../../../index.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DndEmailEditor = ({ open, handleClose }) => {
  const emailEditorRef = useRef(null);

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);
    });
  };

  const onLoad = () => {
    // editor instance is created
    // you can load your template here;
    const templateJson = template;
    emailEditorRef.current.editor.loadDesign(templateJson);
  };

  const onReady = () => {
    // editor is ready
    console.log("onReady");
  };

  return (
    <div>
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
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create Mail
            </Typography>
            <button
              onClick={() => {
                //   onSubmit();
                exportHtml();
              }}
              className="btn btn-light btn-outline-text me-3"
            >
              <SendRoundedIcon className="me-2" /> <span> Export HTML </span>
            </button>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save as draft
            </Button>
          </Toolbar>
        </AppBar>

        <div style={{height: "80vh"}}>
          {/* <div>
           <button onClick={exportHtml}>Export HTML</button>
         </div> */}

          <EmailEditor style={{height: "93.2vh"}} ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
        </div>
      </Dialog>
    </div>
  );
};

export default DndEmailEditor;
