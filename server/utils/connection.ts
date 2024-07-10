import mongoose from "mongoose";
require("dotenv").config();
const connectionDB = async () => {
  await mongoose
    .connect(process.env.DB_URI as string)
    .then(() => {
      console.log("database is connected successfully");
    })
    .catch((err) => {
      console.log("Error in db connection ", err);
    });
};

export default connectionDB;
