import { Router } from "express";
import UserService from "../Profiles/profile.service.js";
import { authnetication } from "../../Middlewares/authentication.middleware.js";
import { hostupload } from "../../Middlewares/multer.middlewares.js";
import { hostuploadLarge } from "../../Middlewares/multerLarge.middlewares.js";

const profileController = Router();

profileController.post(
  "/uploadPhoto",
  authnetication,
  hostupload(),
  UserService.uploadProfile
);
profileController.post(
  "/uploadPhotoLarge",
  authnetication,
  hostuploadLarge(),
  UserService.uploadProfile
);
profileController.post(
  "/sendFriendReq",
  authnetication,
  UserService.sendFriendShipRequest
);
profileController.post("/:_id", UserService.updateProfile);
profileController.get("/listUser", UserService.listUser);
profileController.get("/listReq", authnetication, UserService.listRequset);
profileController.get("/:_id", UserService.getProfile);
profileController.patch("/respondReq",authnetication, UserService.respondFriendShipRequset);

export { profileController };
