import React from "react";
import "./../../../../assets/Sass/DataGrid.scss";
import "./../../../../assets/Sass/TeamManagement.scss";
import dateFormat from "dateformat";
import IconButton from "@material-ui/core/IconButton";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import Divider from "@material-ui/core/Divider";
import DeleteVideo from "../../SubComponents/DeleteVideo";

const now = new Date();

const VideoLibraryListFields = () => {
  const [openDeleteVideo, setOpenDeleteVideo] = React.useState(false);

  const handleCloseDeleteVideo = () => {
    setOpenDeleteVideo(false);
  };
  return (
    <>
      <div className="team-members-list-fields-container">
        <div className="registrations-name-field">
          <div className="registrations-field-label mx-5">Intro video</div>
        </div>
        <div className="registrations-email-field">
          <div className="registrations-field-label">
            {dateFormat(now, "fullDate")}
          </div>
        </div>
        <div className="registrations-phone-field">
          <div className="registrations-field-label">
            {dateFormat(now, "longTime", true)}
          </div>
        </div>
        <div className="registrations-invoice-field">
          <div className="registrations-field-label">
            <div onClick={() => {
              setOpenDeleteVideo(true);
            }}>
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

      <DeleteVideo open={openDeleteVideo} handleClose={handleCloseDeleteVideo} />
    </>
  );
};

export default VideoLibraryListFields;
