import React from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Faker from "faker";

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

const EventSpeakersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
`;

const SpeakerCardBody = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  height: auto;

  display: grid;
  grid-template-columns: 1.5fr 3fr;
  grid-gap: 24px;
`;

const SpeakerCardleft = styled.div`
  border-radius: 10px;
  height: 100%;

  /* display: grid;
grid-auto-flow: column;
grid-template-rows: 3fr 1fr 1fr;
grid-gap: 24px; */
`;

const ProfileName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: #152d35;
  font-family: "Ubuntu";
  text-transform: capitalize;
  text-align: center;
`;

const ProfileSmallText = styled.div`
  font-weight: 500;
  font-size: 0.72rem;
  color: #152d35;
  font-family: "Ubuntu";
  text-transform: capitalize;
`;

const ProfileMediumText = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
  color: #222222;
  font-family: "Ubuntu";
  text-transform: capitalize;
`;

const ButtonOutlinedDark = styled.div`
  padding: 6px 10px;
  text-align: center;

  font-weight: 500;
  font-size: 0.8rem;
  color: #ffffff;
  font-family: "Ubuntu";

  color: #152d35;
  background-color: transparent;

  border: 1px solid #152d35;
  border-radius: 5px;

  &:hover {
    background-color: #152d35;

    color: #ffffff;

    cursor: pointer;
  }
`;

const SpeakerCardRight = styled.div`
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  padding: 10px;
`;

const SpeakerCardComponent = () => {
  const classes = useStyles();

  return (
    <>
      <SpeakerCardBody className="px-4 py-3">
        <SpeakerCardleft className="px-3 py-2">
          <div className="d-flex flex-row align-items-center justify-content-center mb-3">
            <Avatar
              alt={Faker.name.findName()}
              src={Faker.image.avatar()}
              variant="rounded"
              className={classes.large}
              sx={{ width: 100, height: 100 }}
            />
          </div>

          <div style={{ textAlign: "center" }} className="mb-4">
            <ProfileName className="mb-2">{Faker.name.findName()}</ProfileName>
            <ProfileSmallText>Prdouct Manager, Bluemeet</ProfileSmallText>
          </div>

          <ButtonOutlinedDark>Know more</ButtonOutlinedDark>

          <div></div>
        </SpeakerCardleft>

        <SpeakerCardRight>
          When developing an event curriculum, our primary goal is to address
          the most pressing, current and emerging HR management issues, and
          feature speakers who represent the diversity of the SHRM membership
          community. Learn more about speaking at SHRM's events and our Call for
          Presentations process.
        </SpeakerCardRight>
      </SpeakerCardBody>
    </>
  );
};

const Speakers = () => {
  return (
    <>
      <EventSpeakersGrid>
        <SpeakerCardComponent />
        <SpeakerCardComponent />
        <SpeakerCardComponent />
        <SpeakerCardComponent />
      </EventSpeakersGrid>
    </>
  );
};

export default Speakers;
