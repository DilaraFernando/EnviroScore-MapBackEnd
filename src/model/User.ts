import { Schema, model, Document } from 'mongoose';

export type UserRole = 'viewer' | 'analyst' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;      // Made optional for Google Sign-In users
  role: UserRole;
  googleId?: string;      // Added to track linked Google Accounts
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { 
    type: String, 
    // Only required if the account is NOT using Google Authentication
    required: function(this: IUser) { return !this.googleId; } 
  },

  role: { type: String, enum: ['viewer', 'analyst', 'admin'], default: 'viewer' },


  googleId: { type: String, unique: true, sparse: true }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);