import { Router } from "express";
import { fetchCoffeeShops } from "../helpers.js";

const router = Router()

router.route("/")
    .get(async (req, res) => {
        let coffeeShops = await fetchCoffeeShops();
        res.status(200).json(coffeeShops.elements);
    })

export default router;