import { Router } from "express";
import { fetchCoffeeShopById, fetchCoffeeShops } from "../data/locations.js";
import { getReviewById } from "../data/reviews.js";
import * as sessionTokens from "../data/sessionTokens.js";
import { validateNumericId } from "../helpers.js";

const router = Router()

router.get('/', async (req, res) => {
    //used to verify user is logged in
    try {
        let token;
        try {
            token = req.cookies["session_token"];//gets the sessionId
        } catch {
            throw 'no cookie';
        }
        token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
    } catch (e) {
        res.status(401).render('../views/invalidLogin', { error: e });
    }
    try {
        const coffeeShops = await fetchCoffeeShops();
        res.json(coffeeShops);
    } catch (e) {
        res.status(500).json({ error: e });
    }
})

router.get("/:id", async (req, res) => {
    //used to verify user is logged in
    // try{
    //     let token;
    //     try{
    //       token = req.cookies["session_token"];//gets the sessionId
    //     } catch{
    //       throw 'no cookie';
    //     }
    //     token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
    //   } catch(e){
    //     res.status(401).render('../views/invalidLogin', { error: e });
    //   }
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

router.route("/detail/:id")
    .get(async (req, res) => {
        //used to verify that the user is logged in
        try {
            let token;
            try {
                token = req.cookies["session_token"];//gets the sessionId
            } catch {
                throw 'no cookie';
            }
            token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
        } catch (e) {
            res.status(401).render('../views/invalidLogin', { error: e });
        }
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