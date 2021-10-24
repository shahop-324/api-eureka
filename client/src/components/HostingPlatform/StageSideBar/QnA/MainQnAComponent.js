import React from "react";
import styled from "styled-components";
import AnsweredQnA from "./AnsweredQnA";
import QnAInput from "./QnAInput";
import UnansweredQnA from "./UnansweredQnA";

const QnAContainer = styled.div`
  height: 71vh;
  width: 100%;
`;

const Scrollable = styled.div`
  height: 61vh;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const MainQnAComponent = () => {
  return (
    <>
      <QnAContainer>
        <Scrollable className="mb-3">
          {/* Render QnA List Here */}
          <UnansweredQnA className="mb-3" />
          <AnsweredQnA />

        </Scrollable>
        {/* Render QnA input here */}
        <QnAInput />
      </QnAContainer>
    </>
  );
};

export default MainQnAComponent;
