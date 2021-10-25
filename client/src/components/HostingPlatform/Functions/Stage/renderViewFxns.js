import GalleryVideoPlayer from "./../../SessionStreamingComponents.js/GalleryVideoPlayer";
import ShareScreenPlayer from "./../../SessionStreamingComponents.js/ShareScreenPlayer";

const renderLocalStream = (
  allStreams,
  peopleInThisSession
) => {
  if (!allStreams) return;
  const { stream, uid } = allStreams;

  if (!stream || !uid) return;

  let userUID = uid;

  if (document.getElementById(uid)) {
    allStreams.stream.play(uid);
  }

  const {
    userName,
    userImage,
    userOrganisation,
    userDesignation,
    sessionRole,
  } = peopleInThisSession.find((people) => people.userId === userUID);

  return (
    <GalleryVideoPlayer
      localStream={stream}
      role={sessionRole}
      localPlayerId={uid}
      userName={userName}
      userImage={userImage}
      userOrganisation={userOrganisation}
      userDesignation={userDesignation}
    />
  );
};

const renderGalleryView = (allStreams, peopleInThisSession) => {
  if (!allStreams) return;

  return allStreams.map((OneStream) => {
    const { stream, uid } = OneStream;

    let userUID = uid;

    if (document.getElementById(uid)) {
      OneStream.stream.play(uid);
    }

    // console.log(peopleInThisSession, userUID);

    let person = peopleInThisSession.find(
      (people) => people.userId === userUID
    );

    // console.log(person);

    if (!person) return;

    const {
      userName,
      userImage,
      userOrganisation,
      userDesignation,
      sessionRole,
    } = person;

    return (
      <GalleryVideoPlayer
        localStream={stream}
        role={sessionRole}
        localPlayerId={uid}
        userName={userName}
        userImage={userImage}
        userOrganisation={userOrganisation}
        userDesignation={userDesignation}
      />
    );
  });
};

const renderMainStream = (mainStream, peopleInThisSession) => {
  if (!mainStream) return;
  const { stream, uid } = mainStream;

  if (!stream || !uid) return;

  let userUID = uid;

  if (document.getElementById(uid)) {
    mainStream.stream.play(uid);
  }

  const {
    userName,
    userImage,
    userOrganisation,
    userDesignation,
    sessionRole,
  } = peopleInThisSession.find((people) => people.userId === userUID);

  return (
    <GalleryVideoPlayer
      localStream={stream}
      role={sessionRole}
      localPlayerId={uid}
      userName={userName}
      userImage={userImage}
      userOrganisation={userOrganisation}
      userDesignation={userDesignation}
    />
  );
};

const renderMiniStreams = (miniStreams, peopleInThisSession) => {
  if (!miniStreams) return;

  return miniStreams.map((OneStream) => {
    const { stream, uid } = OneStream;

    let userUID = uid;

    if (document.getElementById(uid)) {
      OneStream.stream.play(uid);
    }
    const {
      userName,
      userImage,
      userOrganisation,
      userDesignation,
      sessionRole,
    } = peopleInThisSession.find((people) => people.userId === userUID);

    return (
      <GalleryVideoPlayer
        localStream={stream}
        role={sessionRole}
        localPlayerId={uid}
        userName={userName}
        userImage={userImage}
        userOrganisation={userOrganisation}
        userDesignation={userDesignation}
      />
    );
  });
};

const renderScreenShareStream = (screenStream, peopleInThisSession) => {
  if (!screenStream) return;
  const { stream, uid } = screenStream;

  if (!stream || !uid) return;

  if (document.getElementById(uid)) {
    screenStream.stream.play(uid);
  }

  let userUID = uid;

  if (uid.startsWith("screen")) {
    userUID = userUID.slice(7);
  }

  const { userName, sessionRole } = peopleInThisSession.find(
    (people) => people.userId === userUID
  );

  return (
    <ShareScreenPlayer
      role={sessionRole}
      localPlayerId={uid}
      userName={userName}
    />
  );
};

export {
  renderGalleryView,
  renderLocalStream,
  renderMainStream,
  renderMiniStreams,
  renderScreenShareStream,
};
