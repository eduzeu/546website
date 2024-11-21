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

router.route("/get-coffee").get(async (req, res) => {
    try{
        const coffeeShops = await fetchCoffeeShops();
        res.json(coffeeShops);
    }catch(e){
        res.status(500).json({error: e});
    }

});

export default router;