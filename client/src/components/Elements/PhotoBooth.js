import React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";

import { makeStyles } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    display: "flex",
    minHeight: "76.5vh",
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const PhotoBoothBody = styled.div`
  width: 400px;
  height: 558px;
  background-color: #152d35;
`;

const BtnOutlined = styled.div`
  padding: 5px 8px;
  background-color: transparent;
  /* border: 1px solid #345b63; */

  min-width: 50px;


  color: #152d35;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 3px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* position: absolute;
  bottom: -30px; */
`;

const PhotoGrid = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-gap: 16px;
padding: 10px;
`

const PhotoElement = styled.div`



`

const PhotoBooth = ({ open, handleClose }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
     

        <Dialog
          style={{ backgroundColor: "#2121217E" }}
          fullScreen={fullScreen}
          open={open}
          aria-labelledby="responsive-dialog-title"
        >
            <div className="d-flex flex-column justify-content-between align-items-center">
          <BtnOutlined>Close photo booth</BtnOutlined>



          <BtnOutlined>Download</BtnOutlined>
</div>



          <PhotoBoothBody></PhotoBoothBody>
        </Dialog>
      
    </>
  );
};

export default PhotoBooth;
