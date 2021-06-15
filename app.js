const express = require("express");
const cors = require("cors");
const upload = require("./routes/upload");
require("dotenv").config();

const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
//  origin: "https://victoria-five.vercel.app",
// origin:"http://localhost:3000"
const corsOptions = {
  origin: "https://victoria-five.vercel.app",
};
app.options("*", cors());
app.use(cors(corsOptions));

app.use("/api/upload", upload);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
