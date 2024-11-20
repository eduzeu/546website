import { Router } from "express";
import { getWifiLocations, createWifiReview } from "../data/locations.js";


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

  //console.log(score, text);
  try{
    const wifiReview = await createWifiReview(score, text);
    res.json(wifiReview);
  }catch (e){
    res.status(500).json({error: e});
  }

})



export default router;