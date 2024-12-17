import axios from 'axios';
import ics from "ics";
import { fetchFrom, isoDateToComponents, validateDateString, validateISODateString, validateString, validateStringId } from '../helpers.js';

export const getAllEvents = async () => {
    let response = await axios.get(`https://data.cityofnewyork.us/resource/tvpp-9vvx.json`);
    let data = response.data
    let results = []

    data = data.sort((a, b) => {
        const dateA = new Date(a.start_date_time);
        const dateB = new Date(b.start_date_time);
        return dateA - dateB;
    });

    const now = new Date();

    let curr = now.toISOString();  //to manipluate as date as a string
    curr = curr.split("T");
    curr = curr[0].split("-");

    for (const event of data) {
        if (results.length >= 50) {
            break;
        }
        let eventDates = event.start_date_time;
        let time = eventDates.split("T");

        eventDates = time[0]
        time = time[1].split(":");
        eventDates = eventDates.split("-");

        let formattedDate = eventDates[1] + "/" + eventDates[2] + "/" + eventDates[0];

        const eventDateTime = new Date(eventDates[0], eventDates[1] - 1, eventDates[2]);
        const currentDateTime = new Date(curr[0], curr[1] - 1, curr[2]);

        if (eventDateTime >= currentDateTime) {
            event["start_formatted"] = formattedDate + " Time: " + time[0] + ":" + time[1]
            results.push(event);
        }
    }
    return results
}

export const getEventbyBorough = async (borough) => {
    borough = validateString(borough, "Search Borough")

    let data = await fetchFrom('https://data.cityofnewyork.us/resource/tvpp-9vvx.json');
    let events_in_borough = [];

    data = data.sort((a, b) => {
        const dateA = new Date(a.start_date_time);
        const dateB = new Date(b.start_date_time);
        return dateA - dateB;
    });

    const now = new Date();

    let curr = now.toISOString();  //to manipluate as date as a string
    curr = curr.split("T");
    curr = curr[0].split("-");

    for (const event of data) {
        if (events_in_borough.length >= 50) {
            break;
        }

        if (event.event_borough === borough) {
            let eventDates = event.start_date_time;
            let time = eventDates.split("T");

            eventDates = time[0]
            time = time[1].split(":");
            eventDates = eventDates.split("-");

            let formattedDate = eventDates[1] + "/" + eventDates[2] + "/" + eventDates[0];

            const eventDateTime = new Date(eventDates[0], eventDates[1] - 1, eventDates[2]);
            const currentDateTime = new Date(curr[0], curr[1] - 1, curr[2]);

            if (eventDateTime >= currentDateTime) {
                event["start_formatted"] = formattedDate + " Time: " + time[0] + ":" + time[1]
                events_in_borough.push(event);
            }
        }
    }

    return events_in_borough;
}

export const getEventbyDate = async (date) => {
    date = validateDateString(date, "Search Date");

    let data = await fetchFrom('https://data.cityofnewyork.us/resource/tvpp-9vvx.json');
    let events_in_date = [];

    for (const event of data) {
        if (events_in_date.length >= 50) {
            break;
        }

        let eventDates = event.start_date_time;
        eventDates = eventDates.split("T");

        eventDates = eventDates[0]

        const dateSplit = eventDates.split("-");
        const dateStr = dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0]

        if (eventDates == date) {
            event["start_formatted"] = dateStr;
            events_in_date.push(event);
        }
    }
    return events_in_date;
}

export const getEventICS = async (id, startDate) => {
    id = validateStringId(id, "Event ID");
    startDate = validateISODateString(startDate, "Start Date");

    let data = await fetchFrom(`https://data.cityofnewyork.us/resource/tvpp-9vvx.json?event_id=${id}&start_date_time=${startDate}`);

    if (!data || data.length === 0)
        throw "Event not found"

    data = data[0];

    let icsEvent = {
        title: data.event_name,
        location: `${data.event_location}, ${data.event_borough}`,
        start: isoDateToComponents(data.start_date_time),
        startInputType: "utc",
        startOutputType: "local",
        end: isoDateToComponents(data.end_date_time),
        endInputType: "utc",
        endOutputType: "local"
    }

    const file = ics.createEvent(icsEvent, (error, value) => {
        if (error)
            throw error.message;

        return value;
    })

    return file;
}

export const getEventNameLocations = async () => {
    const data = await fetchFrom("https://data.cityofnewyork.us/resource/tvpp-9vvx.json?$select=event_name, event_location, min(event_id)&$group=event_name, event_location&$order=event_name, event_location asc");

    const output = data.map((item) => {
        return {
            event_name: item.event_name,
            event_location: item.event_location,
            event_id: item.min_event_id
        };
    });

    return output;
}


//console.log(await getEventbyDate("11/27/2024"));

//console.log(await getEventbyBorough("Queens"));

//console.log(await getAllEvents());
