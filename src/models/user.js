const listUser = [];

const addUser = (user) => {
  let index = listUser.findIndex((us) => us.id === user.id);
  if (index === -1) {
    listUser.push(user);
  }
};

const removeUser = (id) => {
  let index = listUser.findIndex((user) => user.id === id);
  if (index !== -1) {
    listUser.splice(index, 1);
  }
};

const getListUserByRoom = (room) => listUser.filter((user) => user.room === room);

const getUserById = (id) => {
  let index = listUser.findIndex((user) => user.id === id);
  if(index === -1) {
    return {}
  }
  return listUser[index];
};

const getIndexUser = (id) => {
  let index = listUser.findIndex((user) => user.id === id);
  return index;
}

module.exports = {
  addUser,
  removeUser,
  getListUserByRoom,
  getUserById,
  getIndexUser,
};
