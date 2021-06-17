const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const blogs = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });
    // console.log(blogs);
    return res.status(200).json({
      msg: "success",
      result: blogs,
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
