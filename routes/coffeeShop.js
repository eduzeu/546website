import { Router } from "express";
import { fetchCoffeeShopById } from "../data/locations.js";
import { getReviewById } from "../data/reviews.js";
import * as helpers from "../helpers.js";
import * as sessionTokens from "../data/sessionTokens.js";

const router = Router()

router.get("/:id", async (req, res) => {
    //used to verify that the user is logged in
    // try{
    //     let token;
    //     try{
    //       token = req.cookies["session_token"];//gets the sessionId
    //     } catch{
    //       throw 'no cookie';
    //     }
    //     token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
    // } catch(e){
    //     res.status(401).render('../views/invalidLogin', { error: e });
    // }
    try {
        req.params.id = helpers.validateNumericId(req.params.id, "Coffee Shop ID");
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