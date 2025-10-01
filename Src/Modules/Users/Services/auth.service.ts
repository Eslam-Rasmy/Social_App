import type { NextFunction, Response, Request } from "express";
import {
  otpTypesEnum,
  type IsignIN,
  type IUser,
} from "../../../Common/index.js";
import { userRepository } from "../../../DB/Repositorye/user.repository.js";
import { UserModel } from "../../../DB/Modles/user.modle.js";
import { encrypt } from "../../../Utils/Encryption/crypto.utils.js";
import {
  generateHash,
  compareHash,
} from "../../../Utils/Encryption/hash.utils.js";
import { localEmitter } from "../../../Utils/index.js";
import { generateToken } from "../../../Utils/Tokens/tokens.utils.js";
import { v4 as uuidv4 } from "uuid";

class AuthService {
  private userRepo: userRepository = new userRepository(UserModel);

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      DOB,
      phoneNumber,
      password,
    }: Partial<IUser> = req.body;

    const isEmailExist = await this.userRepo.findonDocoment({ email }, "email");
    if (isEmailExist)
      return res.status(409).json({
        message: "Email already exists",
        data: { invalidEmail: email },
      });

    const encryptedNumber = encrypt(phoneNumber as string);

    const hashPassword = generateHash(password as string);

    const otp = Math.floor(Math.random() * 1000000).toString();
    localEmitter.emit("sendEmail", {
      to: email,
      subject: "otp for signUp",
      content: `Your otp is ${otp}`,
    });

    const confirmationOtp = {
      value: generateHash(otp),
      expiresAt: Date.now() + 600000,
      otpType: otpTypesEnum.CONFIRMATION,
    };

    const newUser = await this.userRepo.createNewDocoment({
      firstName,
      lastName,
      email,
      password: hashPassword,
      gender,
      DOB,
      phoneNumber: encryptedNumber,
      age,
      OTPS: [confirmationOtp],
    });
    return res.status(201).json({
      message: "User created successfully",
      data: { newUser },
    });
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await this.userRepo.findonDocoment({ email });
    if (!user)
      return res.status(409).json({
        message: "invaild email or password",
        data: { invalidEmail: email },
      });

    const isPasswrdMatch = compareHash(
      password as string,
      user.password as string
    );
    if (!isPasswrdMatch) {
      return res.status(404).json({ message: "invaild email or password" });
    }

    const {
      JWT_ACCESS_SECRET,
      JWT_ACCESS_EXPIRES_IN,
      JWT_REFERSH_SECRET,
      JWT_REFERSH_EXPIRES_IN,
    } = process.env;

    if (
      !JWT_ACCESS_SECRET ||
      !JWT_ACCESS_EXPIRES_IN ||
      !JWT_REFERSH_SECRET ||
      !JWT_REFERSH_EXPIRES_IN
    ) {
      throw new Error("JWT environment variables are not set properly");
    }

    if (!user._id) {
      return res.status(500).json({ message: "User ID is missing" });
    }

    const accesstoken = generateToken(
      { _id: user._id.toString(), email: user.email },
      JWT_ACCESS_SECRET,
      {
        expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
        jwtid: uuidv4(),
      }
    );

    const refershToken = generateToken(
      { _id: user._id.toString(), email: user.email },
      JWT_REFERSH_SECRET,
      {
        expiresIn: Number(JWT_REFERSH_EXPIRES_IN),
        jwtid: uuidv4(),
      }
    );

    return res.status(201).json({
      message: "User signIn succesfully",
      date: { user, accesstoken, refershToken },
    });
  };

  confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp }: { email: string; otp: string } = req.body;

    const user = await this.userRepo.findonDocoment({
      email,
      isConfirmed: false,
    });
    if (!user)
      return res.status(409).json({
        message: "invalid Email",
        data: { invalidEmail: email },
      });

    const confirmationOtp = user.OTPS?.find(
      (otpItem) => otpItem.otpType === otpTypesEnum.CONFIRMATION
    );
    if (!confirmationOtp) {
      return res.status(400).json({ message: "No confirmation OTP found" });
    }

    const isOtpMatched = compareHash(otp, confirmationOtp.value);    
    if (!isOtpMatched) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isConfirmed = true;

    user.OTPS = user.OTPS?.filter(
      (otpItem) => otpItem.otpType !== otpTypesEnum.CONFIRMATION
    );

    await (user as any).save();

    return res.status(201).json({ message: "User confirmed succesfully" });
  };
}

export default new AuthService();
