import mongoose from "mongoose";
import type { IBlack } from "../../Common/index.js";

const blackListSchema = new mongoose.Schema<IBlack>({
  tokenId: { type: String, required: true, unique: true },
  expirationDate: { type: Date, required: true },
});


const BlackList = mongoose.model<IBlack>("BlackList", blackListSchema);

export { BlackList };
