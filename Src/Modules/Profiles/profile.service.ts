import type { Request, Response, NextFunction } from "express";
import type { IRequset } from "../../Common/index.js";
import { uploadFileCloudinary } from "../../Common/Service/cloundiary.service.js";
import { UserModel } from "../../DB/Modles/user.modle.js";
import { HttpException } from "../../Utils/Errors/http.exception.utils.js";

class UserService {
  uploadProfile = async (req: Request, res: Response, next: NextFunction) => {
    const  path = req.file
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
  uploadProfileLarge = async (req: Request, res: Response, next: NextFunction) => {
    const  path = req.file
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
}

export default new UserService();
