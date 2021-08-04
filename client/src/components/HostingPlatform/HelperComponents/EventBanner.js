import React from 'react';

import './../Styles/root.scss';

import Human from './../../../assets/images/humaaans-sitting-1.png';

import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Faker from 'faker';

const useStyles = makeStyles((theme) => ({
    
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  }));

const EventBanner = () => {
    const classes = useStyles();
    return (
        <>
        <div className="event-banner-card d-flex flex-row align-items-center mb-5">
                <div className="banner-side-l px-5 mx-3">
                  <div className="welcome-to-text mb-2">Welcome to,</div>
                  <div className="event-big-name mb-2">
                    Virtual Career Fair India 21'
                  </div>
                  <div className="event-banner-short-description mb-4">
                    Because of such shift, virtual career fair platforms have
                    become indispensable to talent acquisition teams.
                  </div>
                  <div className="hosted-by-wrapper d-flex flex-row align-items-center">
                    <div className="hosted-by-l me-3">
                      <Avatar
                        alt="Travis Howard"
                        src={Faker.image.avatar()}
                        className={classes.large}
                        variant="rounded"
                      />
                    </div>
                    <div className="hosted-by-r">
                      <div className="hosted-by-text">Hosted by</div>
                      <div className="hosted-by-community-name">
                        Gypsy Harghwey
                      </div>
                    </div>
                  </div>
                </div>
                <div className="banner-side-r">
                  <img src={Human} alt="human-welcoming-illustration" />
                </div>
              </div>
        </>
    )
}

export default EventBanner;