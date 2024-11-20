import { Router } from "express";
import { fetchCoffeeShops } from "../data/locations.js";

const router = Router()

router.route("/coffeeShop")
    .get(async (req, res) => {
        const coffeeShops = await fetchCoffeeShops();
        const elements = coffeeShops.elements;
        res.render("coffeeShop", {
            title: "Find Coffee Shops",
            coffeeShops: elements
         });
    })

export default router;