const express = require("express");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const prisma = require("../lib/prisma");
const DatauriParser = require("datauri/parser");
const path = require("path");

const router = express.Router();
const parser = new DatauriParser();

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
    await prisma.post.create({
      data: {
        title: "title",
        category: "category",
        slug: ["slug", "slug-2"],
        content: "content",
        image: photo64.content,
        // author: { connect: { email: session?.user?.email } },
      },
    });

    res.status(200).json({
      msg: "success",
    });
  } catch (error) {
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
});

module.exports = router;
