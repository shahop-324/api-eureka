import React from "react";
import styled from "styled-components";

import { IconButton } from "@material-ui/core";
import { alpha, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import VibePreview from "./../../../assets/images/Vibe.svg";
import Chip from '@mui/material/Chip';

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import Beach from "./../../SessionStage/Images/beach.jpeg";
import Christmas from "./../../SessionStage/Images/christmas.jpeg";
import DarkChristmas from "./../../SessionStage/Images/Darkchristmas.jpeg";
import Desert from "./../../SessionStage/Images/desert.jpeg";
import Festival from "./../../SessionStage/Images/Festival.jpeg";
import Finance from "./../../SessionStage/Images/finance.jpeg";
import Ice from "./../../SessionStage/Images/ice.jpeg";
import Mountains from "./../../SessionStage/Images/Mountains.jpeg";
import NewYear from "./../../SessionStage/Images/new_year.jpeg";
import Ocean from "./../../SessionStage/Images/ocean.jpeg";
import Rocks from "./../../SessionStage/Images/rocks.jpeg";
import Startup from "./../../SessionStage/Images/startup.jpeg";
import Sunrise from "./../../SessionStage/Images/sunrise.jpeg";
import Sunset from "./../../SessionStage/Images/sunset.jpeg";
import Tech from "./../../SessionStage/Images/tech.jpeg";
import Winter from "./../../SessionStage/Images/winter.jpeg";
import Bluemeet from "./../../default-event.jpg";
import UploadStageVibe from "./../SubComponents/UploadStageVibe";
import PreviewStageVibe from "./SubComponent/PreviewStageVibe";
import DeleteStageVibe from "../SubComponents/DeleteStageVibe";

const Paper = styled.div`
  background-color: #ffffff;
  border-radius: 10px;

  width: 100%;
  min-height: 70vh;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;
`;

const SectionHeading = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: #212121;
  font-family: "Ubuntu";
`;

const SubHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #212121;
`;

const TextSmall = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.87rem;
  color: #555555;
  text-align: center;
`;

const TextMini = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.84rem;
  color: #555555;
`;

const StageVibePreview = styled.img`
  height: 700px;
  width: 100%;
  object-fit: contain;
  background-color: transparent !important;
  border-radius: 15px;
`;

const VibeCard = styled.div`
  box-shadow: 0 8px 32px 0 #eeecec;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 15px;
  height: 360px;
`;

const BackdropNameRow = styled.div`
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.85rem;
  color: #212121;
`;

const RadioLabel = styled.div`
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.85rem;
  color: #575757;
`;

const StyledImgWithBackdrop = styled.img`
  height: 220px;
  width: auto;
  object-fit: contain;
`;

const StyledBackDrop = styled.img`
  height: 220px;
  width: auto;
  object-fit: cover;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const StageVibesLibrary = () => {

  const [openUpload, setOpenUpload] = React.useState(false);

  const [openPreview, setOpenPreview] = React.useState(false);

  const [openDelete, setOpenDelete] = React.useState(false);

  const handleCloseUpload = () => {
    setOpenUpload(false);
  }

  const handleOpenPreview = () => {
    setOpenPreview(true);
  }

  const handleClosePreview = () => {
    setOpenPreview(false);
  }

  const handleOpenDelete = () => {
    setOpenDelete(true);
  }

  const handleCloseDelete = () => {
    setOpenDelete(false);
  }

  const classes = useStyles();

  return (
    <>
      <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 pt-4">
        <SectionHeading className="">Stage vibes library</SectionHeading>
        <div className="sec-heading-action-button d-flex flex-row">
          <div
            className={`${classes.search}`}
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>

          <div className="d-flex flex-row align-items-center">
            <button
              className="btn btn-primary btn-outline-text ms-3"
              onClick={() => {
                setOpenUpload(true);
              }}
            >
              Upload backdrop
            </button>
          </div>
        </div>
      </div>

      <TextMini className="mx-4 mb-4">
        Here you can manage backdrops which can be used to set vibes and
        customise stage during your event.
      </TextMini>

      <div className="px-4">
        <Paper className="p-4 mb-5">
          <VibeCard className="p-3">
            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
              {/* <BackdropNameRow className="me-3">Christmas</BackdropNameRow> */}
              <Chip label="Bluemeet" color="success" variant="outlined" />
              </div>
              <div className="d-flex flex-row align-items-center">
              <IconButton onClick={handleOpenDelete} className="">
                <DeleteRoundedIcon style={{ color: "#D62C2C" }} />
              </IconButton>
              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              </div>
            </div>
            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Bluemeet})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
              {/* <BackdropNameRow className="me-3">Christmas</BackdropNameRow> */}
              <Chip label="Christmas" color="success" variant="outlined" />
              </div>
              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}}  />
              </IconButton>
              {/* <IconButton>
                <DeleteRoundedIcon style={{ color: "#D62C2C" }} />
              </IconButton> */}
            </div>
            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Christmas})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Beach" color="success" variant="outlined" />
              </div>
              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>

            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Beach})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            

            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Dark Christmas" color="success" variant="outlined" />
              </div>
              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>

            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${DarkChristmas})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            

            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Desert" color="success" variant="outlined" />
              </div>
              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>

            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Desert})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            


            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Festival" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>



            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Festival})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            


            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Finance" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>


            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Finance})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            

            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Ice" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>

            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Ice})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            


            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Mountains" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>


            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Mountains})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
           

            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="NewYear" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>




            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${NewYear})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            


            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Ocean" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>

            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Ocean})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
           

            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Rocks" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>

            
            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Rocks})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            

            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Startup" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>

            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Startup})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            

            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Sunrise" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>

            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Sunrise})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
           

            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Sunset" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>


            
            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Sunset})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            

            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Tech" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>

            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Tech})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
              }}
              className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
          <VibeCard className="p-3">
            

            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <div className="d-flex flex-row align-items-center">
             
              <Chip label="Winter" color="success" variant="outlined" />
              </div>

              <IconButton onClick={handleOpenPreview}>
                <RemoveRedEyeIcon style={{color: "#F7538A"}} />
              </IconButton>
              
            </div>

            <div className="d-flex flex-row align-items-center mb-3">
              <input
                className="form-check-input me-3"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <RadioLabel>Set as default backdrop</RadioLabel>
            </div>
            <div
              style={{
                height: "220px",
                width: "100%",
                backgroundImage: `${`url(${Winter})`}`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",

                borderRadius: "15px",
              }}
              // className="d-flex flex-row align-items-center justify-content-center"
            ></div>
          </VibeCard>
        </Paper>
      </div>

      <UploadStageVibe open={openUpload} handleClose={handleCloseUpload} />
      <PreviewStageVibe  open={openPreview} handleClose={handleClosePreview}/>
      <DeleteStageVibe open={openDelete} handleClose={handleCloseDelete} />
    </>
  );
};

export default StageVibesLibrary;
