// const allRoles = {
//   user: ['user'],
//   artist: ['consumedByArtistOnly'],
//   admin: ['getUsers', 'manageUsers'],
// };
const roles = ['user', 'admin', 'superAdmin'];

const roleRights = new Map();
roleRights.set(roles[0], ['manageUsers','logout']);
roleRights.set(roles[1], ['consumedByArtistOnly', 'manageUsers','logout']);
roleRights.set(roles[2], ['manageUsers','consumedByArtistOnly','logout']);


module.exports = {
  roles,
  roleRights,
};
