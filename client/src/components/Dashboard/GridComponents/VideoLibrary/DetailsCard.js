import React from "react";
import "./../../../../assets/Sass/DataGrid.scss";
import "./../../../../assets/Sass/TeamManagement.scss";
import IconButton from "@material-ui/core/IconButton";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import Divider from "@material-ui/core/Divider";
import DeleteVideo from "../../SubComponents/DeleteVideo";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { deleteVideo } from "./../../../../actions";

const VideoLibraryListFields = ({ name, id, time, date }) => {
  const [openDeleteVideo, setOpenDeleteVideo] = React.useState(false);

  const params = useParams();
  const dispatch = useDispatch();

  let eventId = params.id;
  let communityId = params.communityId;
  if (eventId && communityId) {
    console.log("We are in an event");
  } else {
    console.log("we are in main dashboard");
  }

  const handleDeleteVideo = () => {
      dispatch(deleteVideo(id));
  };

  const handleCloseDeleteVideo = () => {
    setOpenDeleteVideo(false);
  };
  return (
    <>
      <div className="team-members-list-fields-container">
        <div className="registrations-name-field">
          <div className="registrations-field-label mx-5">{name}</div>
        </div>
        <div className="registrations-email-field">
          <div className="registrations-field-label">{date}</div>
        </div>
        <div className="registrations-phone-field">
          <div className="registrations-field-label">{time}</div>
        </div>
        <div className="registrations-invoice-field">
          <div className="registrations-field-label">
            <div
              onClick={() => {
                setOpenDeleteVideo(true);
              }}
            >
              <IconButton color="secondary" aria-label="add to shopping cart">
                <DeleteRoundedIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>

      <DeleteVideo
        open={openDeleteVideo}
        handleClose={handleCloseDeleteVideo}
        handleDeleteVideo={handleDeleteVideo}
        id={id}
      />
    </>
  );
};

export default VideoLibraryListFields;
