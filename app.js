const express = require("express");
const cors = require("cors");
const upload = require("./routes/upload");
const publish = require("./routes/publish");
const post = require("./routes/post");
require("dotenv").config();

const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
//  origin: "https://vic.vercel.app",
// origin:"http://localhost:3000"
const corsOptions = {
  origin: "https://vic.vercel.app",
};
app.options("*", cors());
app.use(cors(corsOptions));

app.use("/api/upload", upload);
app.use("/api/publish", publish);
app.use("/api/post", post);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
