const express = require("express");
const fs = require("fs");
const cors = require("cors");
const upload = require("./routes/upload");
const isProd = process.env.NODE_ENV === "production";
const corsUrl = isProd
  ? "https://victoria-five.vercel.app"
  : "http://localhost:3000";

const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

const corsOptions = {
  origin: corsUrl,
};
app.options("*", cors());
app.use(cors(corsOptions));

app.use("/api/upload", upload);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
