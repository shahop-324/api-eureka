import React from "react";
import styled from "styled-components";
import Chip from "@mui/material/Chip";

const Overlay = styled.div`
  background-color: #212121d5;
  height: 100vh;
  width: 100vw;
  z-index: 1000000000000000000000000000000000000000000000;
  position: "absolute";
`;

const OverlayLoader = () => {
  return (
    <>
      <div>
        <Overlay className="d-flex flex-column align-items-center justify-content-center">
          <div class="spinner-border text-light mb-4" role="status"></div>

          <a href="/"  target="_blank"  style={{textDecoration: "none"}}>
            <Chip
              style={{
                fontWeight: "500",
                color: "#ffffff",
                border: "1px solid #ffffff",
              }}
              label="Powered by Bluemeet"
              variant="outlined"
            />
          </a>
        </Overlay>
      </div>
    </>
  );
};

export default OverlayLoader;
