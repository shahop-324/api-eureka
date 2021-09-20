import { Dialog } from "@material-ui/core";

import styled from "styled-components";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import React from "react";

const SetReminderPaper = styled.div`
  background-color: #ffffff;
  height: 480px;
  width: 400px;
`;

const SetReminder = ({ open, handleClose }) => {
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
        <SetReminderPaper></SetReminderPaper>
      </Dialog>
    </>
  );
};

export default SetReminder;
