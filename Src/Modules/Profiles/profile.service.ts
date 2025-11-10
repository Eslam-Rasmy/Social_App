import type { Request, Response, NextFunction } from "express";
import {
  friendShipStatusEnum,
  type IFriendShip,
  type IRequset,
  type IUser,
} from "../../Common/index.js";
import { uploadFileCloudinary } from "../../Common/Service/cloundiary.service.js";
import { UserModel } from "../../DB/Modles/user.modle.js";
import { HttpException } from "../../Utils/Errors/http.exception.utils.js";
import { userRepository } from "../../DB/Repositorye/user.repository.js";
import type mongoose from "mongoose";
import { BadRequestException } from "../../Utils/Errors/exception.utils.js";
import { SucessResponse } from "../../Utils/Responses/response-helper.utils.js";
import { friendShipRepository } from "../../DB/Repositorye/friendShip.repository.js";
import type { FilterQuery } from "mongoose";

class UserService {
  private userRepo: userRepository = new userRepository(UserModel);
  private friendShipRepo = new friendShipRepository();

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
        new: true,
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
    res.json(
      SucessResponse<IUser[]>("Profile fetched successfully", 200, users)
    );
  };

  sendFriendShipRequest = async (req: Request, res: Response) => {
    const {
      user: { _id },
    } = (req as unknown as IRequset).loggedInUser;
    const { requestToId } = req.body;

    const isRequsest = await this.friendShipRepo.findonDocoment({
      requestFromId: _id,
      requestToId,
    });
    if (!isRequsest) {
      throw new BadRequestException("request already exists");
    }

    const user = await this.userRepo.findonDocomentById(requestToId);
    if (!user) {
      throw new BadRequestException("user not found");
    }

    await this.friendShipRepo.createNewDocoment({
      requestFromId: _id!,
      requestToId,
    });

    res.json(
      SucessResponse<unknown>("friend ship request sent successfully", 200)
    );
  };

  listRequset = async (req: Request, res: Response) => {
    const {
      user: { _id },
    } = (req as unknown as IRequset).loggedInUser;

    const { status } = req.query;

    const filters: FilterQuery<IFriendShip> = {
      status: status ? status : friendShipStatusEnum.PENNDING,
    };
    if (filters.status == friendShipStatusEnum.ACCEPTED) {
      filters.$or = [{ requestToId: _id }, { requestFromId: _id }];
    } else {
      filters.requestToId = _id;
    }

    const requests = await this.friendShipRepo.findonDocoment(
      filters,
      undefined,
      {
        populate: [
          {
            path: "requestFromId",
            select: "firstName lastName profilePicture",
          },
          {
            path: "requestToId",
            select: "firstName lastName profilePicture",
          },
        ],
      }
    );
    res.json(
      SucessResponse<IFriendShip[]>(
        "Requsets fetched succesfully",
        200,
        requests ? [requests] : []
      )
    );
  };

  respondFriendShipRequset = async (req: Request, res: Response) => {
    const {
      user: { _id },
    } = (req as unknown as IRequset).loggedInUser;

    const { friendRequestId, response } = req.body;

    const friendRequset = await this.friendShipRepo.findonDocoment({
      _id: friendRequestId,
      requestToId:_id,
      status: friendShipStatusEnum.PENNDING,
    });
    if (!friendRequset) {
      throw new BadRequestException("friend request not found");
    }
    (friendRequset as any).status = response;
    await (friendRequset as any).save();

    res.json(
      SucessResponse<IFriendShip[]>(
        "Requsets fetched succesfully",
        200,
        friendRequset ? [friendRequset] : []
      )
    );
  };
}

export default new UserService();
