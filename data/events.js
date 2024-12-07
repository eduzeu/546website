import { fetch, validateDateString, validateString } from '../helpers.js';

export const getAllEvents = async () => {
    let data = await fetch('https://data.cityofnewyork.us/resource/tvpp-9vvx.json');
    let results = []

    for (const event of data) {
        if (results.length >= 50) {
            break;
        }
        let eventDates = event.start_date_time;
        eventDates = eventDates.split("T");

        eventDates = eventDates[0]
        eventDates = eventDates.split("-");

        eventDates = eventDates[1] + "/" + eventDates[2] + "/" + eventDates[0]
        event.start_date_time = eventDates

        results.push(event);
    }

    return results
}

export const getEventbyBorough = async (borough) => {
    validateString(borough, "Search Borough")

    let data = await fetch('https://data.cityofnewyork.us/resource/tvpp-9vvx.json');
    let events_in_borough = [];

    for (const event of data) {
        if (events_in_borough.length >= 50) {
            break;
        }

        if (event.event_borough === borough) {
            let eventDates = event.start_date_time;
            eventDates = eventDates.split("T");

            eventDates = eventDates[0]
            eventDates = eventDates.split("-");

            eventDates = eventDates[1] + "/" + eventDates[2] + "/" + eventDates[0]
            event.start_date_time = eventDates


            events_in_borough.push(event);
        }
    }
    return events_in_borough;
}

export const getEventbyDate = async (date) => {
    validateDateString(date, "Search Date");

    let data = await fetch('https://data.cityofnewyork.us/resource/tvpp-9vvx.json');
    let events_in_date = [];

    for (const event of data) {
        if (events_in_date.length >= 50) {
            break;
        }

        let eventDates = event.start_date_time;
        eventDates = eventDates.split("T");

        eventDates = eventDates[0]
        eventDates = eventDates.split("-");

        eventDates = eventDates[1] + "/" + eventDates[2] + "/" + eventDates[0]

        if (eventDates == date) {
            event.start_date_time = eventDates
            events_in_date.push(event);
        }
    }
    return events_in_date;
}


//console.log(await getEventbyDate("11/27/2024"));

//console.log(await getEventbyBorough("Queens"));

//console.log(await getAllEvents());
