const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { boolean } = require('joi');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: false,
      default: 'TeamSOLEcial',
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    profilePic: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 8,
      // validate(value) {
      //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
      //     throw new Error('Password must contain at least one letter and one number');
      //   }
      // },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'admin',
    },

    stats: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Stats',
    },
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
      },
    ],

    artworks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
      },
    ],
    favouriteArtworks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    creations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
      },
    ],
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    isblock: { type: Boolean, default: false },
    code: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 *
 * @param {string} address
 * @param {ObjectId} excludeUserId
 * @returns {Promise<boolean>}
 */
userSchema.statics.isAddressTaken = async function (address, excludeUserId) {
  const user = await this.findOne({ address, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 *
 * @param {string} userName
 * @param {ObjectId} excludeUserId
 * @param {ObjectId} roles
 * @returns {Promise<boolean>}
 */

userSchema.statics.isUsernameTaken = async function (userName, excludeUserId) {
  const user = await this.findOne({ userName, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  const user = this;
  if (this._update.password) {
    this._update.password = await bcrypt.hash(String(this._update.password), 8);
  }
  next();
});
/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
