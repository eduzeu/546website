import { Router } from "express";
import xss from "xss";
import { getAllEvents, getEventbyBorough, getEventbyDate, getEventICS } from '../data/events.js';
import { validateDateString, validateISODateString, validateNumericId, validateString } from "../helpers.js";

const router = Router()

router.route("/")
    .get(async (req, res) => {
        try {
            let allEvents = await getAllEvents();
            res.render('../views/events', { 'title': 'Events', 'events': allEvents });
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

        searchBorough = xss(searchBorough);

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

        searchDate = xss(searchDate);

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

router.route("/ics")
    .get(async (req, res) => {
        try {
            req.body.eventId = validateNumericId(req.body.eventId, "Event Id");
            req.body.startDate = validateISODateString(req.body.startDate, "Start Date");
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        req.body.eventId = xss(`${req.body.eventId}`);
        req.body.startDate = xss(req.body.startDate);

        try {
            const icsFile = await getEventICS(req.body.eventId, req.body.startDate);
            res.set('Content-Type', 'text/calendar');
            res.set('Content-Disposition', `attachment; filename="${req.body.eventId}-${req.body.startDate}.ics"`);
            return res.send(icsFile);

        } catch (e) {
            return res.status(400).send(e);
        }
    })

export default router;