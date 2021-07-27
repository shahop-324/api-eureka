const users = [];
const sessions = [];
const sessionUsers = [];
let stageMembers=0;

// Add session (setting status to started)

const addSession = ({ id, sessionStatus, sessionId, room }) => {
  //   name = name.trim().toLowerCase();
  //   room = room.trim().toLowerCase();

  const existingSession = sessions.find(
    (session) => session.room === room && session.sessionId === sessionId
  );

  if (!room || !sessionId) return { error: "sessionId and room are required." };
  // if(existingSession) return { error: 'Session is taken.' };

  const session = { id, sessionStatus, sessionId, room };

  if (!existingSession) {
    sessions.push(session);
  }

  return { session };
};

// Update session (setting status to paused)

const updateSession = ({ id, sessionStatus, sessionId, room }) => {
  //   name = name.trim().toLowerCase();
  //   room = room.trim().toLowerCase();

  const existingSession = sessions.find(
    (session) => sesasion.room === room && session.sessionId === sessionId
  );

  if (!room || !sessionId) return { error: "sessionId and room are required." };
  if (existingSession) {
    existingSession.sessionStatus = sessionStatus;
  }

  return { existingSession };
};


// Remove session (setting status to ended)

const removeSession = (id) => {
  //console.log(users,"20 lobby controller")
  const index = sessions.findIndex((session) => session.id === id);

  if (index !== -1) return sessions.splice(index, 1)[0];
};


const removeUserFromSession = (id) => {
  //console.log(users,"20 lobby controller")
  const index = sessionUsers.findIndex((user) => user.id === id);

  if (index !== -1) {
    
    
    if(role==="host" || role==="speaker") {
      stageMembers--;
    }
    return sessionUsers.splice(index, 1)[0];
  
  
  }
};
//const removeUser = (id) => users.filter((user) => user.id !== id);

// const getUser = (id) => users.find((user) => user.id === id);

const getSessionsInRoom = (room) =>
  sessions.filter((session) => session.room === room);

const addUser = ({ id, email, room }) => {
  //   name = name.trim().toLowerCase();
  //   room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.email === email
  );

  if (!room || !email) return { error: "email and room are required." };
  // if(existingUser) return { error: 'Username is taken.' };

  const user = { id, email, room };

  if (!existingUser) {
    users.push(user);
  }

  return { user };
};

const addUserInSession = ({ id, userId, room, role }) => {
  //   name = name.trim().toLowerCase();
  //   room = room.trim().toLowerCase();

  const existingUser = sessionUsers.find(
    (user) => user.room === room && user.userId === userId
  );

  if (!room || !userId) return { error: "userId and room are required." };
  // if(existingUser) return { error: 'Username is taken.' };

  const sessionUser = { id, userId, room,role  };
if(role==="host"||role==="speaker")
{

   stageMembers+=1;

}
   
    


  if (!existingUser) {
    sessionUsers.push(sessionUser);
  }

  return { sessionUser };
};




const removeUser = (id) => {
  console.log(users, "20 lobby controller");
  const index = users.findIndex((user) => user.id === id);

  console.log(index);

  if (index !== -1) return users.splice(index, 1)[0];
};
//const removeUser = (id) => users.filter((user) => user.id !== id);

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getUsersInSession = (room) => sessionUsers.filter((sessionUser) => sessionUser.room === room);

const getStageMembers = () => stageMembers;

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addSession,
  updateSession,
  removeUserFromSession,
  getSessionsInRoom,
  getStageMembers,
  addUserInSession,
  getUsersInSession,
  removeSession,
};
