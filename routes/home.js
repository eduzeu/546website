import { Router } from "express";
import { getWifiLocations, createWifiReview, getWifiReviews, fetchCoffeeShops} from "../data/locations.js";


const router = Router()

router.route('/').get(async (req, res) => {
  res.render('../views/account');
});

router.route('/home').get(async (req, res) => {
  res.render('../views/home');
});

router.route('/wifi-locations').get(async (req, res) =>{
  try{
    const wifiLocations = await getWifiLocations();
    res.json(wifiLocations);
  }catch (e){
    res.status(500).json({ error: 'Failed to fetch Wi-Fi locations' });
  }
});


router.route('/wifi-review').post(async (req, res) => {
  let score = req.body.rating;
  let text = req.body.text;
  let id = req.body.id;
  //console.log(score, text);
  try{
    const wifiReview = await createWifiReview(score, text,id);
    res.json(wifiReview);
  }catch (e){
    res.status(500).json({error: e});
  }
});

router.route('/get-review').get(async (req, res) => {
  try{
    const reviews = await getWifiReviews();
    res.json(reviews);
  }catch (e){
    res.status(500).json({error: e});
  }
});

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