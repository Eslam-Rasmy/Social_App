import { Types } from "mongoose";
import {
  GenderEnum,
  otpTypesEnum,
  PROVIDERENUM,
  RoleEnum,
} from "../../Common/Enums/user.enum.js";

interface IOTP {
  value: string;
  expiresAt: number;
  otpType: otpTypesEnum;
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
  profilePicture?: string | undefined;
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

interface IBlack {
  tokenId: string;
  expirationDate: Date;
}

interface IsignIN {
  email: string;
  password: string;
}

 


export type { IUser, IEmailArgument, IBlack, IsignIN };
