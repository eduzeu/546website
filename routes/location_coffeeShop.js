import { Router } from "express";
import { fetchCoffeeShopById, fetchCoffeeShops } from "../data/locations.js";
import { validateNumericId } from "../helpers.js";

const router = Router()

router.get('/', async (req, res) => {
    try {
        const coffeeShops = await fetchCoffeeShops();
        res.json(coffeeShops);
    } catch (e) {
        res.status(500).json({ error: e });
    }
})

router.get("/:id", async (req, res) => {
    try {
        req.params.id = validateNumericId(req.params.id, "Coffee Shop ID");
    } catch (e) {
        return res.status(400).json({ error: e });
    }

    try {
        const coffeeShop = await fetchCoffeeShopById(req.params.id);
        return res.status(200).json(coffeeShop);

    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

export default router;