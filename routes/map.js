import { Router } from "express";

const router = Router()

router.route('/').get(async (req, res) => {
  res.render('../views/map', { title: "WiFly NYC - map" });
});

export default router;