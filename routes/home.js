import { Router } from "express";

const router = Router()

router.route('/').get(async (req, res) => {
  res.render('../views/account');
});

router.route('/home').get(async (req, res) => {
  res.render('../views/home');
});

router.route('/map').get(async (req, res) => {
  res.render('../views/map');
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
  res.render('../views/home', { title: "WiFly NYC" });
});

export default router;