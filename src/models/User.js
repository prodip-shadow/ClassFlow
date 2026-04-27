import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    photoURL: { type: String, default: '' },
    role: { type: String, enum: ['teacher', 'student'], required: true },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
