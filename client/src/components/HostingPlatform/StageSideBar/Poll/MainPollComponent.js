import React from "react";
import styled from "styled-components";
import PollComponent from "./PollComponent";

const MainPollContainer = styled.div`
  height: 71vh;
  width: 100%;
`;

const Scrollable = styled.div`
  height: 71vh;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const MainPollComponent = () => {
  return (
    <>
      <MainPollContainer>
        <Scrollable className="mb-3">
          <PollComponent />
          <PollComponent />
        </Scrollable>
      </MainPollContainer>
    </>
  );
};

export default MainPollComponent;
