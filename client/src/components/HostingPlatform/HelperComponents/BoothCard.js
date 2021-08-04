import React from 'react';
import './../Styles/booth.scss';

import Faker from 'faker';

import Avatar from '@material-ui/core/Avatar';
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
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));

const BoothCard = (props) => {
  const classes = useStyles();
  return (
    <>
      <div className="booth-card-wrapper px-4 py-3">
        <img
          className="booth-card-poster mb-3"
          src={props.url}
          alt="booth-poster"
        ></img>

        <div className="booth-logo-brand-name-and-short-description d-flex flex-row ">
          <Avatar
            alt="Remy Sharp"
            src={Faker.image.avatar()}
            variant="rounded"
            className={classes.large}
          />

          <div className="booth-brand-name-and-short-description ms-4">
                <div className="booth-card-brand-name mb-2">
                    {Faker.company.companyName()}
                </div>
                <div className="booth-card-short-description">
                    {Faker.company.catchPhrase()}
                </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoothCard;
