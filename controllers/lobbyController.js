const users = [];

const addUser = ({ id, email, room }) => {
//   name = name.trim().toLowerCase();
//   room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room===room&&user.email===email);

  if( !room||!email) return { error: 'email and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, email, room };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
    console.log(users,"20 lobby controller")
  const index = users.findIndex((user) => user.id === id);

  console.log(index);

  if(index !== -1) return users.splice(index, 1)[0];
}
//const removeUser = (id) => users.filter((user) => user.id !== id);



const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };