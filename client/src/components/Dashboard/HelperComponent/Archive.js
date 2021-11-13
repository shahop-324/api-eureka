import React from "react";
import styled from "styled-components";

import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import NoItem from "./../../../assets/images/NoWish.png";

import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import ArchiveListFields from "./Archive/ListFields";
import ArchiveDetailCard from "./Archive/DetailsCard";

const Container = styled.div`
  height: 600px;
  width: 1200px;
`;

const Heading = styled.div`
  font-weight: 500;
  font-size: 1rem;
  color: #212121;
`;

const IllustrationContainer = styled.div`
  height: 550px;
  width: 100%;
`;

const Image = styled.img`
  border-radius: 15px;
  height: 200px;
  width: "100%";
  object-fit: contain;
`;

const NoWishText = styled.div`
  font-weight: 500;
  font-size: 0.85rem;
  color: #212121;
`;

const Archive = ({ open, handleClose }) => {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Dialog
        maxWidth="1200px"
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <Container className="px-4">
          <div
            style={{ borderBottom: "1px solid #B3B3B3" }}
            className="d-flex flex-row align-items-center justify-content-between py-3"
          >
            <Heading>Archive</Heading>
            <IconButton
              onClick={() => {
                handleClose();
              }}
            >
              <CancelOutlinedIcon />
            </IconButton>
          </div>

          {/* Scrollable container */}
          {/* <ArchiveListFields />
              <ArchiveDetailCard /> */}

          <IllustrationContainer className="d-flex flex-column align-items-center justify-content-center">
            <Image src={NoItem} />
            <NoWishText className="my-3">
              There're no events in your archive
            </NoWishText>
          </IllustrationContainer>
        </Container>
      </Dialog>
    </>
  );
};

export default Archive;
