import Post from '../schemas/Post.js';
import User from '../schemas/User.js';

class PostController {
  // Create a new post
  static async createPost(req, res) {
    try {
      const { content, userId, image } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          error: 'User not found.',
        });
      }
      // Create a new post
      const newPost = new Post({
        content,
        userId,
        image,
        user: {
          username: user.userName, // Assuming you have a userName field in the User schema
          profilePicture: user.profilePicture,
          isVerified: user.isVerified,
        },
      });

      // Save the post to the database
      await newPost.save();

      res.status(201).json({
        message: 'Post created successfully.',
        post: newPost,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }

  // Get all posts
  static async getAllPosts(req, res) {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });

      res.status(200).json({
        message: 'Posts retrieved successfully.',
        posts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }

  // Get a post by ID
  static async getPostById(req, res) {
    try {
      const postId = req.params.id;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          error: 'Post not found.',
        });
      }

      res.status(200).json({
        message: 'Post retrieved successfully.',
        post,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }

  // Update a post by ID
  static async updatePostById(req, res) {
    try {
      const postId = req.params.id;
      const { content, image } = req.body;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          error: 'Post not found.',
        });
      }

      post.content = content;
      post.image = image;

      await post.save();

      res.status(200).json({
        message: 'Post updated successfully.',
        post,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }

  // Delete a post by ID
  static async deletePostById(req, res) {
    try {
      const postId = req.params.id;

      const post = await Post.findByIdAndDelete(postId);

      if (!post) {
        return res.status(404).json({
          error: 'Post not found.',
        });
      }

      res.status(200).json({
        message: 'Post deleted successfully.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }
  static async getPostsByUserId(req, res) {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          error: 'User not found.',
        });
      }

      const posts = await Post.find({ userId }).sort({ createdAt: -1 });

      res.status(200).json({
        message: 'Posts retrieved successfully.',
        posts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }
  // Add a comment to a post
static async addComment(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming you have the user ID from authentication
    const { text } = req.body;

    // Check if the post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found.',
      });
    }

    // Find the user to get profilePicture, username, and isVerified
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
      });
    }

    // Create a new comment
    const newComment = new Comment({
      post: postId,
      text,
      user: userId,
      profilePicture: user.profilePicture,
      username: user.username,
      isVerified: user.isVerified,
    });

    await newComment.save();

    // Update the post's comments count
    post.comments.push(newComment._id);
    post.commentsCount += 1;
    await post.save();

    res.status(200).json({
      message: 'Comment added successfully.',
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}
static async toggleLikePost(req, res) {
  try {
    const { postId, userId } = req.body; // Assuming you have the user ID from authentication

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Check if the user has already liked the post
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // User has already liked the post, so remove the like
      post.likes = post.likes.filter((likeId) => likeId.toString() !== userId);
      await post.save();
      return res.status(200).json({ message: 'Post unliked successfully.', post });
    } else {
      // User hasn't liked the post, so add the like
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({ message: 'Post liked successfully.', post });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
}

export default PostController;
