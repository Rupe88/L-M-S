import app from "./app";

require("dotenv").config();
//create our server

app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});
