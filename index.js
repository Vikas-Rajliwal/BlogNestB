const app =require("./app.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT;
const  connectDB  = require("./src/db/index.db.js");

(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
})();