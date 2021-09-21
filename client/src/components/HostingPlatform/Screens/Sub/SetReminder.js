import { Dialog } from "@material-ui/core";
import styled from "styled-components";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import React from "react";

const WidgetHeadlineWithClose = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  font-size: 1rem;
  font-weight: 500;
  font-family: "Ubuntu";
  color: #152d35;

  border-bottom: 1px solid #152d35;
`;

const SetReminderPaper = styled.div`
  background-color: #ffffff;
  height: 480px;
  width: 400px;
`;

const FormLabel = styled.div`
  font-weight: 500;
  font-size: 0.85rem;
  font-family: "Ubuntu";
  color: #152d35;

  margin-bottom: 6px;
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
        <SetReminderPaper className="px-4 py-3">
        <WidgetHeadlineWithClose className="pb-1 mb-4">
            <div>Set Reminder</div>
            <div style={{ textAlign: "end" }}>
              <IconButton
                onClick={() => {
                  handleClose();
                }}
              >
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </WidgetHeadlineWithClose>

          <FormLabel>Personal note</FormLabel>

          <textarea className="form-control" ></textarea>

          <FormLabel className="">Personal note</FormLabel>



        </SetReminderPaper>
      </Dialog>
    </>
  );
};

export default SetReminder;
