import React from "react";
import styled from "styled-components";
import Chip from "@mui/material/Chip";

const Overlay = styled.div`
  background-color: #FFFFFF;
  height: 100%;
  min-height: 100vh;
  width: 100vw;
  z-index: 1000000000000000000000000000000000000000000000;
  position: "absolute";
`;

const StyledAnchor = styled.a`
  &:hover {
    cursor: pointer;
  }
`;

const OverlayLoader = () => {
  return (
    <>
      <div>
        <Overlay className="d-flex flex-column align-items-center justify-content-center">
          <div class="spinner-border text-primary mb-4" role="status"></div>

          <StyledAnchor
            href="/"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <Chip
              style={{
                fontWeight: "600",
                color: "#538BF7",
                border: "1px solid #538BF7",
              }}
              label="Powered by Bluemeet"
              variant="outlined"
            />
          </StyledAnchor>
        </Overlay>
      </div>
    </>
  );
};

export default OverlayLoader;
