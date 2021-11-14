import React, { useRef } from "react";
import template from "./../../../../design.json";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import EmailEditor from "react-email-editor";
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
      handleClose();
      window.location.reload();
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
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create Mail
            </Typography>
            <button
              onClick={() => {
                exportHtml();
              }}
              className="btn btn-light btn-outline-text me-3"
            >
              <span> Save & close </span>
            </button>
          </Toolbar>
        </AppBar>

        <div style={{ height: "80vh" }}>
          <EmailEditor
            projectId="47137"
            style={{ height: "93.2vh" }}
            ref={emailEditorRef}
            onLoad={onLoad}
            onReady={onReady}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default DndEmailEditor;
