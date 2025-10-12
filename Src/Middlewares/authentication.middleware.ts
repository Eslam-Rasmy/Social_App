import type { NextFunction, Response, Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "../Utils/Tokens/tokens.utils.js";
import type { IRequset, IUser } from "../Common/index.js";
import { userRepository } from "../DB/Repositorye/user.repository.js";
import { UserModel } from "../DB/Modles/user.modle.js";
import { BlackListedRepository } from "../DB/Repositorye/black-listed.repository.js";
import { BlackList } from "../DB/Modles/blackList.model.js";
import { HttpException } from "../Utils/Errors/http.exception.utils.js";

const userRepo = new userRepository(UserModel);
const blackLitsedRepo =  new BlackListedRepository(BlackList)

export const authnetication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers["authorization"];
  if (!accessToken) {
    throw next(new HttpException("please login first",400))
    }
  

  const [prefix, token] = accessToken.split(" ");
  if (prefix !== process.env.JWT_PREFIX || !token) {
    return res.status(401).json({
      message: "invalid token",
    });
  }

  const decodeDate = verifyToken(
    token,
    process.env.JWT_ACCESS_SECRET as string
  );
  if (typeof decodeDate === "string" || !("_id" in decodeDate)) {
    return res.status(401).json({ message: "invalid payload" });
  }

  const blackLitsedToken = await blackLitsedRepo.findonDocoment({tokenId: decodeDate.jti})
   if (blackLitsedToken) {
    return res.status(404).json({
      message: "your session is expired please to login again",
    });
  }

  const user: IUser | null = await userRepo.findonDocomentById(
    decodeDate._id,
    "-password"
  );
  if (!user) {
    return res.status(404).json({
      message: "please register first",
    });
  }

  (req as unknown as IRequset).loggedInUser = { user, token: decodeDate as JwtPayload };
  next();
};
