import { Router } from "express";
import { createWifiReview, getWifiLocations, getWifiReviews } from "../data/locations.js";


const router = Router()

router.route('/').get(async (req, res) => {
  res.render('../views/account');
});

router.route('/home').get(async (req, res) => {
  res.render('../views/home', { title: "WiFly NYC" });
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

export default router;