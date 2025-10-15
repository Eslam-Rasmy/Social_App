import type { Request, Response, NextFunction } from "express";
import type { IRequset, IUser } from "../../Common/index.js";
import { uploadFileCloudinary } from "../../Common/Service/cloundiary.service.js";
import { UserModel } from "../../DB/Modles/user.modle.js";
import { HttpException } from "../../Utils/Errors/http.exception.utils.js";
import { userRepository } from "../../DB/Repositorye/user.repository.js";
import type mongoose from "mongoose";
import { BadRequestException } from "../../Utils/Errors/exception.utils.js";
import { SucessResponse } from "../../Utils/Responses/response-helper.utils.js";

class UserService {
  private userRepo: userRepository = new userRepository(UserModel);

  uploadProfile = async (req: Request, res: Response, next: NextFunction) => {
    const path = req.file;
    const {
      user: { _id },
    } = (req as unknown as IRequset).loggedInUser;

    const { secure_url, public_id } = await uploadFileCloudinary(
      path?.path as string,
      {
        folder: "Social_App/Users/Profiles",
      }
    );

    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      {
        profilePicture: {
          secure_url,
          public_id,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(new HttpException("User not found", 404));
    }

    return res.status(200).json({
      message: "Profile uploaded successfully",
      user: updatedUser,
    });
  };
  uploadProfileLarge = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const path = req.file;
    const {
      user: { _id },
    } = (req as unknown as IRequset).loggedInUser;

    const { secure_url, public_id } = await uploadFileCloudinary(
      path?.path as string,
      {
        folder: "Social_App/Users/Profiles",
      }
    );

    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      {
        profilePicture: {
          secure_url,
          public_id,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(new HttpException("User not found", 404));
    }

    return res.status(200).json({
      message: "Profile uploaded successfully",
      user: updatedUser,
    });
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      DOB,
      phoneNumber,
      password,
    }: IUser = req.body;

    const user = await this.userRepo.findonDocomentById(
      req.params._id as unknown as mongoose.Schema.Types.ObjectId
    );
    if (!user) {
      throw new BadRequestException("User not found");
    }
    /*    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (DOB) user.DOB = DOB;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (password) user.password = password;

    await (user as any).save(); */

    await this.userRepo.updateOneDocoment(
      { _id: req.params._id, email },
      {
        $set: {
          firstName,
          lastName,
          email,
          age,
          gender,
          DOB,
          phoneNumber,
          password,
        },
      },
      {
        new:true 
      }
    );

    res.json(SucessResponse<IUser>("profile update successfully", 200, user));
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userRepo.findonDocomentById(
      req.params._id as unknown as mongoose.Schema.Types.ObjectId
    );
    if (!user) throw new BadRequestException("User not found");
    res.json(SucessResponse<IUser>("Profile fetched successfully", 200, user));
  };

    listUser = async (req: Request, res: Response) => {
    const users = await (this.userRepo.findonDocments() as any);
    res.json(SucessResponse<IUser[]>("Profile fetched successfully", 200, users));
  };
}

export default new UserService(); 
