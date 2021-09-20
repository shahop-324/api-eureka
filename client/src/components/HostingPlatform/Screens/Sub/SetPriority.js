import { Dialog } from "@material-ui/core";

import styled from "styled-components";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import React from "react";

const SetPriorityPaper = styled.div`
  background-color: #ffffff;
  height: 480px;
  width: 400px;
`;

const SetPriority = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        // maxWidth={"668px"}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <SetPriorityPaper></SetPriorityPaper>
      </Dialog>
    </>
  );
};

export default SetPriority;
