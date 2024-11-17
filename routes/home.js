import { Router } from "express";

const router = Router()

router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  res.render('../views/home');
});


  //code here for POST this is where your form will be submitting searchByTitle and then call your data function passing in the searchByTitle and then rendering the search results of up to 50 Movies.

export default router;