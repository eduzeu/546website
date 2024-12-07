import { Router } from "express";
import { getAllEvents, getEventbyBorough, getEventbyDate } from '../data/events.js';
import { validateDateString, validateString } from "../helpers.js";

const router = Router()

router.route("/")
    .get(async (req, res) => {
        try {
            let allEvents = await getAllEvents();
            res.render('events', { 'title': 'Events', 'events': allEvents });
        } catch (e) {
            return res.status(400).send(e);
        }
    })

router.route("/city")
    .get(async (req, res) => {
        try {
            res.render('cities', { 'title': 'Events by Borough' });
        } catch (e) {
            return res.status(400).send(e);
        }
    })
    .post(async (req, res) => {
        let searchBorough = req.body.searchByBorough;
        try {
            searchBorough = validateString(searchBorough, 'Search Borough');
        } catch (e) {
            return res.status(400).send(e);
        }

        try {
            const events = await getEventbyBorough(searchBorough);

            if (events.length === 0) {
                return res.status(404).send('No events found for the specified date.');
            }

            return res.render('results', {
                title: 'Search Events by Borough',
                events: events,
                searchBorough: searchBorough
            });
        } catch (e) {
            return res.status(500).send(e);
        }
    });

router.route("/date")
    .get(async (req, res) => {
        try {
            res.render('dates', { 'title': 'Events by Date' });
        } catch (e) {
            return res.status(400).send(e);
        }
    })
    .post(async (req, res) => {
        let searchDate = req.body.searchByDate;

        try {
            searchDate = validateDateString(searchDate, "Search Date");
        } catch (e) {
            return res.status(400).send(e);
        }

        try {
            const events = await getEventbyDate(searchDate);

            if (events.length === 0) {
                return res.status(404).send('No events found for the specified date.');
            }

            return res.render('results', {
                title: 'Search Events by Date',
                events: events,
                searchDate: searchDate
            });
        } catch (e) {
            return res.status(500).send(e);
        }
    });

export default router;