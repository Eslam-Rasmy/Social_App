import type { IFriendShip } from "../../Common/index.js";
import { friendShipModel } from "../Modles/friendShip.model.js";
import { BaseRepository } from "./base.repository.js";



export class friendShipRepository extends BaseRepository<IFriendShip>{
    constructor(){
        super(friendShipModel)
    }
}