import { Router } from "express";

const router = Router()

router.route("/")
    .get((req, res) => {
        res.status(200).json({"implement": "this"});
    })

router.route("/:id")
    .get((req, res) => {
        res.status(200).json({"implement": "this"});
    })

export default router;