import { Router } from "express";

const router = Router()

router.route('/').get(async (req, res) => {
  res.render('../views/account');
});

export default router;