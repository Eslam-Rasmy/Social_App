import { Router } from "express";
import authService from "../Services/auth.service.js";
import { authnetication } from "../../../Middlewares/authentication.middleware.js";
import { ValidatonMiddleware } from "../../../Middlewares/validation.middleware.js";
import { SignUpValidator } from "../../../Validators/User/auth.validators.js";

const authController = Router();

authController.post("/signUp",ValidatonMiddleware(SignUpValidator), authService.signUp);
authController.post("/signIn", authService.signIn);
authController.put("/confirm", authService.confirmEmail);
authController.post("/logout",authnetication ,authService.logout);
authController.delete("/delete",authnetication ,authService.deletAcoount);




export { authController };
