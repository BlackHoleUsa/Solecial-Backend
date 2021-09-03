const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const web3 = require('web3');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  } else if (!(await web3.utils.isAddress(userBody.address))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'address is not valid');
  } else if (await User.isAddressTaken(userBody.address)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'address already taken');
  } else if (await User.isUsernameTaken(userBody.userName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'userName already taken');
  }

  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserByAddress = async (address) => {
  return User.findOne({ address });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await User.findByIdAndUpdate(userId, updateBody, {
    new: true,
  });

  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 *
 * @param {ObjectId} userId
 * @param {ObjectId} artworkId
 * @returns {Promise<User>}
 */
const addArtworkToFavourites = async (userId, artworkId) => {
  return await User.findOneAndUpdate({ _id: userId }, { $push: { favouriteArtworks: artworkId } });
};

/**
 *
 * @param {ObjectId} userId
 * @param {ObjectId} artworkId
 * @returns {Promise<User>}
 */
const removeArtworkFromFavourite = async (userId, artworkId) => {
  return await User.findOneAndUpdate({ _id: userId }, { $pull: { favouriteArtworks: artworkId } });
};

/**
 *
 * @param {ObjectId} userId
 * @param {number} page
 * @param {number} perPage
 */

const getFavouriteArtworks = async (userId, page, perPage) => {
  const user = await User.findOne({ _id: userId })
    .select(['favouriteArtworks'])
    .populate('favouriteArtworks')
    .limit(parseInt(perPage))
    .skip(page * perPage);

  return user.favouriteArtworks;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserByAddress,
  addArtworkToFavourites,
  removeArtworkFromFavourite,
  getFavouriteArtworks,
};
