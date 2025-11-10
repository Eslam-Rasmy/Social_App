import { Types } from "mongoose";
import {
  friendShipStatusEnum,
  GenderEnum,
  otpTypesEnum,
  PROVIDERENUM,
  RoleEnum,
} from "../../Common/Enums/user.enum.js";
import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

export interface IMessage {
  _id?: Types.ObjectId;
  text?: string;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  attachments?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConversation {
  _id?: Types.ObjectId;
  type?: "direct" | "group" | string ;
  name?: string ;
  members?: Types.ObjectId[] | undefined;
  createdAt?: Date;
  updatedAt?: Date;
}


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

interface IFriendShip {
  requestFromId: Types.ObjectId;
  requestToId: Types.ObjectId;
  status: friendShipStatusEnum;
}

export type { IUser, IEmailArgument, IBlack, IsignIN, IRequset, IFriendShip };
