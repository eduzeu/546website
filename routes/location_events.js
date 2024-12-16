import { Router } from "express";
import xss from "xss";
import { getAllEvents, getEventbyBorough, getEventbyDate, getEventICS } from '../data/events.js';
import { validateDateString, validateISODateString, validateString, validateStringId } from "../helpers.js";

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

router.route("/ics/:id/:date")
    .post(async (req, res) => {
        let eventId = req.params.id;
        let startDate = req.params.date;

        try {
            eventId = validateStringId(eventId, "Event Id");
            startDate = validateISODateString(startDate, "Start Date");
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        eventId = xss(eventId);
        startDate = xss(startDate);

        try {
            const icsFile = await getEventICS(eventId, startDate);
            res.set('Content-Type', 'text/calendar');
            res.set('Content-Disposition', `attachment; filename="${req.body.eventId}-${startDate}.ics"`);
            return res.send(icsFile);

        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })

export default router;