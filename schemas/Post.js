import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User who created the post
    required: true,
  },
 
  image: {
    type: String,
    required: false,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who liked the post
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
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
});

const Post = mongoose.model('Post', postSchema);

export default Post;
