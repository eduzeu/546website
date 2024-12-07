import { Router } from "express";
import { fetchCoffeeShopById } from "../data/locations.js";
import { getReviewById } from "../data/reviews.js";
import { validateNumericId } from "../helpers.js";

const router = Router()

router.get("/:id", async (req, res) => {
    try {
        req.params.id = validateNumericId(req.params.id, "Coffee Shop ID");
    } catch (e) {
        return res.render("error", {
            title: "Error",
            class: "error",
            message: e
        })
    }

    try {
        const coffeeShop = await fetchCoffeeShopById(req.params.id);
        const review = await getReviewById(req.params.id, "coffee");

        let overallRating = undefined;
        if (review && review.rating.length !== 0) {
            overallRating = review.rating.reduce((x, y) => x + y, 0) / review.rating.length;
        }

        return res.render("coffeeShop", {
            title: coffeeShop.tags.name,
            coffeeShop: coffeeShop,
            review: review,
            overallRating: overallRating
        })

    } catch (e) {
        return res.render("error", {
            title: "Error",
            class: "error",
            message: e
        })
    }
})

export default router;