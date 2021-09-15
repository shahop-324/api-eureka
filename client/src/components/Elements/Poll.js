import React from "react";
import styled from "styled-components";

const PollBody = styled.div`
width: 100%;
height: 400px;


  background: #EEEEEE0A;
  /* box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); */
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Poll = () => {
  return (
    <>
      <PollBody>

      </PollBody>
    </>
  );
};

export default Poll;
