import React from "react";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import LanguageRoundedIcon from "@material-ui/icons/LanguageRounded";
import Avatar from "@material-ui/core/Avatar";
import Faker from "faker";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const SpeakerCard = ({
  firstName,
  lastName,
  bio,
  speakerSocialHandles,
  imgURL,
  id,
}) => {
  const classes = useStyles();
  return (
    <div className="speaker-card px-4 py-3" key={id}>
      <Avatar
        alt={firstName}
        variant="rounded"
        className={classes.large}
        src={imgURL}
      />
      {/* <AvatarComponent variant="rounded" alt={firstName} imgURL={Faker.image.avatar()} /> */}
      <div className="speaker-card-other-details">
        <div className="speaker-name mb-2 px-3">{firstName + " " + lastName}</div>
        <div className="speaker-about mb-2 px-3">{bio}</div>
        <div className="speaker-social-media-grid">
          <IconButton>
            <LinkedInIcon style={{ fill: "#2565A5" }} />
          </IconButton>
          <IconButton>
            <TwitterIcon style={{ fill: "#539FF7" }} />
          </IconButton>
          <IconButton>
            <FacebookIcon style={{ fill: "#1760A8" }} />
          </IconButton>
          <IconButton>
            <InstagramIcon style={{ fill: "#DD2A7B" }} />
          </IconButton>
          <IconButton>
            <LanguageRoundedIcon style={{ fill: "#A59EA0" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default SpeakerCard;
