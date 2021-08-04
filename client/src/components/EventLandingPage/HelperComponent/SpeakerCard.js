import React from 'react';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LanguageRoundedIcon from '@material-ui/icons/LanguageRounded';
import Avatar from '@material-ui/core/Avatar';
import Faker from 'faker';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
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

const AvatarComponent = (props) => {
  const classes = useStyles();
  return (
    <Avatar alt="Remy Sharp" className={classes.large} src={props.imgURL} />
  );
};

const SpeakerCard = ({firstName,lastName,bio,speakerSocialHandles,id}) => {
  return (
    <div className="speaker-card px-4 py-3" key={id}>
      <AvatarComponent imgURL={Faker.image.avatar()} />
      <div className="speaker-card-other-details">
        <div className="speaker-name mb-2">{firstName+' '+lastName}</div>
        <div className="speaker-about mb-2">
       {bio}
        </div>
        <div className="speaker-social-media-grid">
          <LinkedInIcon style={{fill: '#2565A5'}} />
          <TwitterIcon style={{fill: '#539FF7'}} />
          <FacebookIcon style={{fill: '#1760A8'}} />
          <InstagramIcon style={{fill: '#DD2A7B'}}/>
          <LanguageRoundedIcon style={{fill: '#A59EA0'}}/>
        </div>
      </div>
    </div>
  );
};

export default SpeakerCard;
