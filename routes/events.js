import { Router } from "express";
import { getAllEvents, getEventbyDate } from '../data/events.js';

const router = Router()

router.route("/")
    .get(async (req, res) => {
        try{
            let allEvents = await getAllEvents();
            res.render('events', {'title':'Events', 'events': allEvents});
          }catch(e){
            return res.status(400).send(e);
          }
    })

router.route("/city")
    .get(async (req, res) => {
        try{
            res.render('city', {'title':'Events by Bourough'});
        }catch(e){
            return res.status(400).send(e);
        }
    }).post(async (req, res) => {
        const searchDate = req.body.searchByDate;
        try {
            if (!searchDate) throw 'You must provide a date to search for';
            const events = await getEventbyDate(searchDate);
            
            return res.render('dates', {title: 'Search Events by Date',events: events, searchDate: searchDate
            });
        }catch{ 
            return res.status(400).send(e);
        }
    });
    
router.route("/date")
    .post(async (req, res) => {
        let searchDate = req.body.searchByDate;
        try{
            let dates = await getEventbyDate(searchDate);
            res.render('dates', {'title':'Events by Date', 'events': dates});
        }catch(e){
            return res.status(400).send(e);
        }
    })

export default router;