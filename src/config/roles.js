// const allRoles = {
//   user: ['user'],
//   artist: ['consumedByArtistOnly'],
//   admin: ['getUsers', 'manageUsers'],
// };
const roles = ['user', 'artist', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['manageUsers']);
roleRights.set(roles[1], ['consumedByArtistOnly', 'manageUsers']);
roleRights.set(roles[2], []);


module.exports = {
  roles,
  roleRights,
};
