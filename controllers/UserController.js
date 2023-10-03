import User from '../schemas/User.js';
import bcrypt from 'bcrypt'
import jwt  from'jsonwebtoken'

class UserController {
  static async signUp(req, res) {
    try {
      const { firstName, lastName, userName, isVerified, profilePicture, email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).send({
          error: 'This email is already in use. Please login.',
          success: false,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        userName,
        isVerified,
        profilePicture,
        password: hashedPassword,
      });

      const payload = {
        email: newUser.email,
        isVerified: newUser.isVerified,
        id: newUser.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return res.status(201).send({
        message: 'User created successfully.',
        success: true,
        token,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          userName: newUser.userName,
          profilePicture: newUser.profilePicture,
          email: newUser.email,
          followers: newUser.followers,
          following: newUser.following,
          isVerfied: newUser.isVerified,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal server error',
        success: false,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).send({
          error: 'No user found with this email.',
          success: false,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).send({
          error: 'Incorrect password.',
          success: false,
        });
      }

      const payload = {
        email: user.email,
        isVerified: user.isVerified,
        id: user.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return res.status(200).send({
        message: 'User logged in successfully.',
        success: true,
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          profilePicture: user.profilePicture,
          email: user.email,
          followers: user.followers,
          following: user.following,
          isVerfied: user.isVerified,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal server error',
        success: false,
      });
    }
  }
  static async getUser(req, res) {
    try {
      const userId = req.params.id; // Get the user ID from the request params

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send({
          error: 'User not found.',
          success: false,
        });
      }

      return res.status(200).send({
        message: 'User retrieved successfully.',
        success: true,
        user,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal server error',
        success: false,
      });
    }
  }

  // Update user by ID
  static async updateUser(req, res) {
    try {
      const userId = req.params.id; // Get the user ID from the request params
      const updates = req.body; // Get the updated user data from the request body

      const user = await User.findByIdAndUpdate(userId, updates, { new: true });

      if (!user) {
        return res.status(404).send({
          error: 'User not found.',
          success: false,
        });
      }

      return res.status(200).send({
        message: 'User updated successfully.',
        success: true,
        user,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal server error',
        success: false,
      });
    }
  }
  static async getAllUsers(req, res) {
    try {
      const users = await User.find();

      return res.status(200).send({
        message: 'Users retrieved successfully.',
        success: true,
        users,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal server error',
        success: false,
      });
    }
  }
  // Delete user by ID
  static async deleteUser(req, res) {
    try {
      const userId = req.params.id; // Get the user ID from the request params

      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).send({
          error: 'User not found.',
          success: false,
        });
      }

      return res.status(200).send({
        message: 'User deleted successfully.',
        success: true,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal server error',
        success: false,
      });
    }
  }
  static async followUser(req, res) {
    try {
      const userIdToFollow = req.params.id; // Get the ID of the user to follow
      const currentUserId = req.body.currentUserId; // Get the current user's ID from the request body

      // Check if the user is trying to follow themselves
      if (userIdToFollow === currentUserId) {
        return res.status(400).send({
          error: 'You cannot follow yourself.',
          success: false,
        });
      }

      // Find the user to follow
      const userToFollow = await User.findById(userIdToFollow);

      if (!userToFollow) {
        return res.status(404).send({
          error: 'User not found.',
          success: false,
        });
      }

      // Check if the current user is already following the user
      if (userToFollow.followers.includes(currentUserId)) {
        return res.status(400).send({
          error: 'You are already following this user.',
          success: false,
        });
      }

      // Add the current user to the followers list of the user being followed
      userToFollow.followers.push(currentUserId);
      await userToFollow.save();

      // Add the user to the following list of the current user
      const currentUser = await User.findById(currentUserId);
      if (!currentUser) {
        return res.status(404).send({
          error: 'Current user not found.',
          success: false,
        });
      }
      currentUser.following.push(userIdToFollow);
      await currentUser.save();

      return res.status(200).send({
        message: 'You are now following the user.',
        success: true,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal server error',
        success: false,
      });
    }
  }
  static async unfollowUser(req, res) {
    try {
      const userIdToUnfollow = req.params.id; // Get the ID of the user to unfollow
      const currentUserId = req.body.currentUserId; // Get the current user's ID from the request body

      // Check if the user is trying to unfollow themselves
      if (userIdToUnfollow === currentUserId) {
        return res.status(400).send({
          error: 'You cannot unfollow yourself.',
          success: false,
        });
      }

      // Find the user to unfollow
      const userToUnfollow = await User.findById(userIdToUnfollow);

      if (!userToUnfollow) {
        return res.status(404).send({
          error: 'User not found.',
          success: false,
        });
      }

      // Check if the current user is currently following the user
      if (!userToUnfollow.followers.includes(currentUserId)) {
        return res.status(400).send({
          error: 'You are not following this user.',
          success: false,
        });
      }

      // Remove the current user from the followers list of the user being unfollowed
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (followerId) => followerId !== currentUserId
      );
      await userToUnfollow.save();

      // Remove the user from the following list of the current user
      const currentUser = await User.findById(currentUserId);
      if (!currentUser) {
        return res.status(404).send({
          error: 'Current user not found.',
          success: false,
        });
      }
      currentUser.following = currentUser.following.filter(
        (followingId) => followingId !== userIdToUnfollow
      );
      await currentUser.save();

      return res.status(200).send({
        message: 'You have unfollowed the user.',
        success: true,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        error: 'Internal server error',
        success: false,
      });
    }
  }
}

export default UserController;