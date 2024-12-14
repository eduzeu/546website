import { Router } from "express";

const router = Router();

router.route("/")
  .get(async (req, res) => {
    try {
      res.render("userFeed", {
        title: "User Feed",
        cloudName: JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME),
        uploadPreset: JSON.stringify(process.env.CLOUDINARY_UPLOAD_PRESET)
      });
    } catch (e) {
      return res.status(400).send(e);
    }
  });

export default router;