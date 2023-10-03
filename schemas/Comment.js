import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    username: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to Users who liked the comment
    },
  ],
  image: {
    type: String, // URL or path to the image
  },
  replies: [
    {
      text: {
        type: String,
        required: true,
      },
      user: {
        username: {
          type: String,
        },
        profilePicture: {
          type: String,
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
      },
      userId: {
        type: String,
        required: true,
      },
      likes: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User', // Reference to Users who liked the reply
        },
      ],
      image: {
        type: String, // URL or path to the image for the reply
      },
    },
  ],
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
