const express = require("express");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const path = require("path");
const prisma = require("../lib/prisma");
const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
const parser = new DatauriParser();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);

router.post("/", async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const photo = await fs.promises
    .readFile(data.files.image.path)
    .catch((err) => console.error("Failed to read file", err));

  let photo64 = parser.format(
    path.extname(data.files.image.name).toString(),
    photo
  );

  try {
    const uploadResult = await cloudinaryUpload(photo64.content);
    const result = await prisma.product.create({
      data: {
        name: data.fields.product_name,
        price: Number(data.fields.selling_price),
        discount: Number(data.fields.discount),
        description: data.fields.description,
        image: uploadResult.secure_url,
      },
    });

    return res.status(200).json({
      msg: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    console.log(products);
    return res.status(200).json({
      msg: "success",
      result: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
});

module.exports = router;
