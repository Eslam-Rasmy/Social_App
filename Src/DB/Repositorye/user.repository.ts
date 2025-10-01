import type { Model } from "mongoose";
import type { IUser } from "../../Common/index.js";
import { UserModel } from "../Modles/user.modle.js";
import { BaseRepository } from "./base.repository.js";

export class userRepository extends BaseRepository<IUser> {
  constructor(protected _userModel: Model<IUser>) {
    super(_userModel);
  }


  
}


