import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Faker from 'faker';

const SessionCard = ({
  startDate,
  startTime,
  endTime,
  sessionName,
  sessionDescription,
  speakerAvatarList,
  id
}) => {
  const renderSpeakerAvatarList = (speakerAvatarList) => {
    
    console.log(speakerAvatarList);
    if (speakerAvatarList[0]) {
      return speakerAvatarList.map((speaker) => {
        return <Avatar alt={speaker.name} src={Faker.image.avatar()} />;
      });
    }
    return <div />;
  };

  return (
    <div key={id} className="session-card mb-3 px-3 py-4">
      <div className="session-date-time-venue-section mb-3">
        {startDate} {startTime}-{endTime}
      </div>
      <div className="session-name mb-2">{sessionName}</div>
      <div className="session-description mb-2">{sessionDescription}</div>

      <div className="session-speakers-grid">
        {renderSpeakerAvatarList(speakerAvatarList)}
      </div>
    </div>
  );
};

export default SessionCard;
