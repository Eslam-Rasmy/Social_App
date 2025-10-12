import type { Model } from "mongoose";
import type { IBlack } from "../../Common/index.js";
import { BlackList } from "../Modles/blackList.model.js";
import { BaseRepository } from "./base.repository.js";

 


 export class BlackListedRepository extends BaseRepository <IBlack>{
        constructor(protected _usermodel: Model<IBlack>){
            super(BlackList)
        }
 }