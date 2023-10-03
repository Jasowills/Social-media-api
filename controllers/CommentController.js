import Comment from '../schemas/Comment.js'; // Import your Comment model
import User from '../schemas/User.js'; // Import your User model

class CommentController {
  // Create a new comment
  static async createComment(req, res) {
    try {
      const { postId, userId, text, image } = req.body;

      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Create a new comment
      const comment = new Comment({
        postId,
        userId,
        text,
        image,
        user: {
          username: user.userName,
          profilePicture: user.profilePicture,
          isVerified: user.isVerified,
        },
      });

      // Save the comment to the database
      await comment.save();

      res.status(201).json({ message: 'Comment created successfully.', comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Get comments by postId
  static async getCommentsByPostId(req, res) {
    try {
      const postId = req.params.postId;
      const comments = await Comment.find({ postId }).exec();

      if (!comments) {
        return res.status(404).json({ error: 'Comments not found.' });
      }

      res.status(200).json({ message: 'Comments retrieved successfully.', comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async addReplyToComment(req, res) {
    try {
      const { commentId, userId, text, image } = req.body;

      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Find the comment by commentId
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found.' });
      }

      // Create a new reply
      const reply = {
        userId,
        text,
        image,
        user: {
          username: user.userName,
          profilePicture: user.profilePicture,
          isVerified: user.isVerified,
        },
      };

      comment.replies.push(reply);
      await comment.save();

      res.status(201).json({ message: 'Reply added successfully.', comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Update a comment by commentId
  static async updateComment(req, res) {
    try {
      const { commentId, text, image } = req.body;

      // Find the comment by commentId
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found.' });
      }

      // Update comment fields if provided
      if (text) {
        comment.text = text;
      }
      if (image) {
        comment.image = image;
      }

      // Save the updated comment to the database
      await comment.save();

      res.status(200).json({ message: 'Comment updated successfully.', comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Delete a comment by commentId
  static async deleteComment(req, res) {
    try {
      const { commentId } = req.params;

      // Find the comment by commentId
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found.' });
      }

      // Delete the comment
      await comment.remove();

      res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Delete a reply by replyId
  static async deleteReply(req, res) {
    try {
      const replyId = req.params.replyId;

      // Find the comment that contains the reply
      const comment = await Comment.findOneAndUpdate(
        { 'replies._id': replyId },
        { $pull: { replies: { _id: replyId } } },
        { new: true }
      );

      if (!comment) {
        return res.status(404).json({ error: 'Reply not found.' });
      }

      res.status(200).json({ message: 'Reply deleted successfully.', comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
 
  static async toggleLikeToComment(req, res) {
    try {
      const { commentId, userId } = req.body;

      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Find the comment by commentId
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found.' });
      }

      // Check if the user has already liked the comment
      const isLiked = comment.likes.includes(userId);

      if (isLiked) {
        // User has already liked the comment, so remove the like
        comment.likes = comment.likes.filter((likeId) => likeId.toString() !== userId);
        await comment.save();
        return res.status(200).json({ message: 'Comment unliked successfully.', comment });
      } else {
        // User hasn't liked the comment, so add the like
        comment.likes.push(userId);
        await comment.save();
        return res.status(200).json({ message: 'Comment liked successfully.', comment });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Toggle like/unlike on a reply by userId
  static async toggleLikeToReply(req, res) {
    try {
      const { replyId, userId } = req.body;

      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Find the comment that contains the reply
      const comment = await Comment.findOne({ 'replies._id': replyId });

      if (!comment) {
        return res.status(404).json({ error: 'Reply not found.' });
      }

      // Find the reply by replyId
      const reply = comment.replies.find((r) => r._id.toString() === replyId);

      if (!reply) {
        return res.status(404).json({ error: 'Reply not found.' });
      }

      // Check if the user has already liked the reply
      const isLiked = reply.likes.includes(userId);

      if (isLiked) {
        // User has already liked the reply, so remove the like
        reply.likes = reply.likes.filter((likeId) => likeId.toString() !== userId);
        await comment.save();
        return res.status(200).json({ message: 'Reply unliked successfully.', comment });
      } else {
        // User hasn't liked the reply, so add the like
        reply.likes.push(userId);
        await comment.save();
        return res.status(200).json({ message: 'Reply liked successfully.', comment });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

}

export default CommentController;
