import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Validate email format using a regular expression
        return /\S+@\S+\.\S+/.test(value);
      },
      message: 'Email address is invalid.',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profilePicture: {
    type: String, // Assuming the profile picture is stored as a URL
  },
  coverPhoto: {
    type: String, // Assuming the cover photo is stored as a URL
  },
  bio: {
    type: String, // User's bio
  },
  location: {
    type: String, // User's location
  },
  isVerified: {
    type: Boolean,
    default: false, // Default value is false
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to other User documents
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to other User documents
    },
  ],
  resetTokens: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ResetToken',
    },
  ],
});

// Create a User model using the userSchema
const User = mongoose.model('User', userSchema);

export default User;
