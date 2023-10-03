import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../schemas/User.js';
import ResetToken from '../schemas/ResetToken.js'

const passwordResetController = {
  // Request a password reset email
  requestPasswordReset: async (req, res) => {
    const { email } = req.body;

    try {
      // Find the user by their email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Generate a unique reset token
      const token = new ResetToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      });

      // Save the token to the user's resetTokens array
      user.resetTokens.push(token);
      await user.save();

      // Configure nodemailer to send emails (use your own email service)
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'Jujuzhaddy01@gmail.com',
          pass: 'Jujufather2',
        },
      });

      const mailOptions = {
        from: 'your-email@gmail.com',
        to: user.email,
        subject: 'Password Reset Request',
        html: `Click the following link to reset your password: <a href="http://yourwebsite.com/reset-password/${token.token}">Reset Password</a>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Email could not be sent.' });
        } else {
          res.status(200).json({ message: 'Password reset email sent.' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Reset the password with a valid token
  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      // Find the reset token
      const resetToken = await ResetToken.findOne({ token, used: false });

      if (!resetToken || resetToken.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Invalid or expired token.' });
      }

      // Find the user associated with the token
      const user = await User.findById(resetToken.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Update the user's password and mark the token as used
      user.password = newPassword;
      resetToken.used = true;

      // Save the updated user and token
      await user.save();
      await resetToken.save();

      res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default passwordResetController;
