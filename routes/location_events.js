import { Router } from "express";
import xss from "xss";
import { getAllEvents, getEventbyBorough, getEventbyDate, getEventNameLocations } from '../data/events.js';
import * as sessionTokens from "../data/sessionTokens.js";
import { validateDateString, validateString } from "../helpers.js";

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
                return res.render('error', {
                    title: 'Search Events by Borough',
                    class: 'error',
                    message: 'No events found.',
                });
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
                return res.render('error', {
                    title: 'Search Events by Date',
                    class: 'error',
                    message: 'No events found for the specified date.',
                });
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

router.route("/names")
  .get(async (req, res) => {
    try {
        let token;
        try {
            token = req.cookies["session_token"];//gets the sessionId
        } catch {
            throw 'no cookie';
        }
        token = await sessionTokens.sessionChecker(token);//checks if sessionId is valid
    } catch (e) {
        return res.status(401).json({ error: e });
    }

    try {
      const names = await getEventNameLocations();
      res.json(names);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

export default router;