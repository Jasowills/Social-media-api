import express from 'express';
import UserController from '../controllers/UserController.js';
import PostController from '../controllers/PostController.js';
import CommentController from '../controllers/CommentController.js';
import MessageController from '../controllers/MessageController.js';
import passwordResetController from '../controllers/ResetPasswordController.js';
const router = express.Router();

// user route
router.post('/user/signup', UserController.signUp);
router.delete('/user/:id', UserController.deleteUser);
router.put('/user/:id', UserController.updateUser);
router.get('/user/:id', UserController.getUser);
router.post('/user/login', UserController.login);
router.get('/users/', UserController.getAllUsers);
router.post('/users/:id/follow', UserController.followUser);
router.post('/users/:id/unfollow', UserController.unfollowUser);

// post route
router.post('/posts', PostController.createPost);
router.get('/posts', PostController.getAllPosts);
router.get('/posts/user/:id', PostController.getPostsByUserId);
router.get('/posts/:id', PostController.getPostById);
router.put('/posts/:id', PostController.updatePostById);
router.delete('/posts/:id', PostController.deletePostById);

// comment route
router.post('/posts/:postId/comments', CommentController.createComment);
router.get('/posts/:postId/comments', CommentController.getCommentsByPostId);
router.post('/comments/reply', CommentController.addReplyToComment);
router.put('/comments/:commentId', CommentController.updateComment);
router.delete('/comments/:commentId', CommentController.deleteComment);
router.delete('/comments/reply/:replyId', CommentController.deleteReply);

// Like route
router.post('/comments/like', CommentController.toggleLikeToComment);
router.post('/reply/like', CommentController.toggleLikeToReply);
router.post('/post/like', PostController.toggleLikePost);

// message route

router.post('/send', MessageController.sendMessage);
router.get('/:senderId/:receiverId', MessageController.getConversation);

// reset password

router.post('/forgot-password', passwordResetController.requestPasswordReset);
router.post('/reset-password/:token', passwordResetController.resetPassword);


export default router;
