import app from "./app";
import connectionDB from "./utils/connection";

require("dotenv").config();
//create our server

app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
  connectionDB();
});
