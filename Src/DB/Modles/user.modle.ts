import mongoose from "mongoose";
import {
  GenderEnum,
  otpTypesEnum,
  PROVIDERENUM,
  RoleEnum,
} from "../../Common/Enums/user.enum.js";
import type { IUser } from "../../Common/index.js";

const userSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    minLength: [4, "firstName must be at least 4 char long"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [4, "lastName must be at least 4 char long"],
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
      name: "idx_email_unique",
    },
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: GenderEnum,
    default: GenderEnum.OTHER,
  },
  role: {
    type: String,
    enum: RoleEnum,
    default: RoleEnum.USER,
  },
  DOB: {
    type: Date,
  },
  profilePicture: {
    secure_url: String,
    public_id: String,
  },
  coverPicture: {
    type: String,
  },
  provider: {
    type: String,
    enum: PROVIDERENUM,
    default: PROVIDERENUM.LOCAL,
  },
  googleId: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
  phoneNumber: {
    type: String,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  OTPS: [
    {
      value: { type: String, required: true },
      createdAt: { type: String, default: Date.now() + 600000 },
      otpType: { type: String, enum: otpTypesEnum, required: true },
    },
  ],
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export { UserModel };
