import "dotenv/config";
import express from "express";
import { dbConnection } from "./DB/db.connection.js";
import { authController } from "./Modules/Users/Controllers/auth.controller.js";
import type { NextFunction, Response, Request } from "express";
import { HttpException } from "./Utils/Errors/http.exception.utils.js";
import { FailedResponse } from "./Utils/Responses/response-helper.utils.js";
import { profileController } from "./Modules/Profiles/profile.controller.js";
import { getIo, ioIntializer } from "./Gateways/socketIo.gateway.js";
import cors from "cors";



const app = express();


app.use(express.json());


app.use(cors());

dbConnection();

app.use("/users", authController);
app.use("/profile", profileController);


app.use(
  (
    err: HttpException | Error | null,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const status = 500;
    const message = "Something went wrong";
    if (err) {
      if (err instanceof HttpException) {
        res
          .status(err.statusCode || status)
          .json(FailedResponse(err.message,err.statusCode,err.error));
      }else{
        res.status(500).json(FailedResponse("SomeThing went wrong",500,err))
      }
    }
  }
);

const port: number | string = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running  + ${port}`);
});


ioIntializer(server)

