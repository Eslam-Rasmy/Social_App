import { Router } from "express";
import authService from "../Services/auth.service.js";

const authController = Router();

authController.post("/signUp", authService.signUp);
authController.post("/signIn", authService.signIn);
authController.put("/confirm", authService.confirmEmail);


export { authController };
