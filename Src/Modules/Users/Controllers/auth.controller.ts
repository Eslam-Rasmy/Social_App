import { Router } from "express";
import authService from "../Services/auth.service.js";
import { authnetication } from "../../../Middlewares/authentication.middleware.js";

const authController = Router();

authController.post("/signUp", authService.signUp);
authController.post("/signIn", authService.signIn);
authController.put("/confirm", authService.confirmEmail);
authController.post("/logout",authnetication ,authService.logout);
authController.delete("/delete",authnetication ,authService.deletAcoount);




export { authController };
