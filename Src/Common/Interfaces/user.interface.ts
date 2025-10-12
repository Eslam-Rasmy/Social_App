import { Types } from "mongoose";
import {
  GenderEnum,
  otpTypesEnum,
  PROVIDERENUM,
  RoleEnum,
} from "../../Common/Enums/user.enum.js";
import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

interface IOTP {
  value: string;
  expiresAt: number;
  otpType: otpTypesEnum;
}

export interface IProfilePicture {
  secure_url: string;
  public_id: string;
}

interface IUser {
  _id?: Types.ObjectId;
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  role: RoleEnum;
  gender?: GenderEnum | undefined;
  provider: PROVIDERENUM;
  googleId?: string | undefined;
  phoneNumber?: string | undefined;
  DOB?: Date | undefined;
  coverPicture?: string | undefined;
  profilePicture?: IProfilePicture;
  isVerified?: boolean | undefined;
  age?: number | undefined;
  OTPS?: IOTP[] | undefined;
  isConfirmed?: boolean | undefined;
}

interface IEmailArgument {
  to: string;
  cc?: string;
  subject: string;
  content: string;
  attachments?: [];
}

interface IBlack extends Document {
  tokenId: string | undefined;
  expirationDate: Date;
}

interface IsignIN {
  email: string;
  password: string;
}

interface IRequset extends Request {
  loggedInUser: { user: IUser; token: JwtPayload };
}

export type { IUser, IEmailArgument, IBlack, IsignIN, IRequset };
