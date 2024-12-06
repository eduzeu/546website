import { Router } from "express";
import { getAllEvents, getEventbyDate, getEventbyBorough } from '../data/events.js';

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
        const searchBorough = req.body.searchByBorough;
        try {
            if (!searchBorough) throw 'You must provide a borough to search for';
            const events = await getEventbyBorough(searchBorough);
            return res.render('results', {
                title: 'Search Events by Borough',
                events: events,
                searchBorough: searchBorough
            });
        } catch (e) {
            return res.status(400).send(e);
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
        const searchDate = req.body.searchByDate;
        try {
            if (!searchDate) throw 'You must provide a date to search for in format mm/dd/yyyy';
            const events = await getEventbyDate(searchDate);
            return res.render('results', {
                title: 'Search Events by Date',
                events: events,
                searchDate: searchDate
            });
        } catch (e) {
            return res.status(400).send(e);
        }
    });

export default router;