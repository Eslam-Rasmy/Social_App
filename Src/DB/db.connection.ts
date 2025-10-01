import mongoose from "mongoose";

export async function dbConnection() {
  try {
    await mongoose.connect(process.env.DB_URL_LOCAL as string);
    console.log("Db connected sucess");
    
  } catch (error) {
    console.log(`erorr connectibg${error}`);
  }
}
