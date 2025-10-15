import mongoose from "mongoose";
import {
  GenderEnum,
  otpTypesEnum,
  PROVIDERENUM,
  RoleEnum,
} from "../../Common/Enums/user.enum.js";
import type { IUser } from "../../Common/index.js";
import { encrypt, decrypt } from "../../Utils/Encryption/crypto.utils.js";
import { generateHash } from "../../Utils/Encryption/hash.utils.js";

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

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = generateHash(this.password as string);
  }

  if (this.isModified("phoneNumber")) {
    this.phoneNumber = encrypt(this.phoneNumber as string);
  }
});

userSchema.post(/^find/, function (doc) {
  if ((this as unknown as { op: string }).op == "find") {
    doc.forEach((user: IUser) => {
      if (user.phoneNumber) {
        user.phoneNumber = decrypt(user.phoneNumber as string);
      }
    });
  } else {
    doc.phoneNumber = decrypt(doc.phoneNumber as string);
  }
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export { UserModel };
