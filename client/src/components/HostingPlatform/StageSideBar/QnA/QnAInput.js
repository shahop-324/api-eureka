import { IconButton } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import SendRoundedIcon from "@mui/icons-material/SendRounded";


const StyledInputWrapper = styled.div`
  display: grid;
  grid-template-columns: 4fr 0.5fr;
  grid-gap: 16px;
  align-items: center;
  border-radius: 15px;
  border: 1px solid #152d3f;
  padding: 2px 12px;
`;

const StyledInput = styled.input`
  border: none;
  height: 100%;
  background-color: #ffffff00;
  outline: none;
  color: #ffffff;
`;

const QnAInput = () => {
  return (
    <>
      <StyledInputWrapper>
        <StyledInput
          type="text"
          placeholder="Ask your question here..."
        >
           

        </StyledInput>
        <IconButton className="icon-btn">
          <SendRoundedIcon />
        </IconButton>
      </StyledInputWrapper>
    </>
  );
};

export default QnAInput;
