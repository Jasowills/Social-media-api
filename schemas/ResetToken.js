import mongoose from 'mongoose';

const { Schema } = mongoose;

const resetTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

export default ResetToken;
