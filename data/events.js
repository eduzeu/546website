import axios from 'axios'; 
import { response } from 'express';

export const getAllEvents = async ()=> {
    let response = await axios.get(`https://data.cityofnewyork.us/resource/tvpp-9vvx.json`);

    let data = response.data
    
    return data
}

export const getEventbyBorough = async (city) => {
    let response = await axios.get('https://data.cityofnewyork.us/resource/tvpp-9vvx.json');
    let data = response.data;
    let events_in_borough = [];

    for (const event of data) {
        if (event.event_borough === city) {
            events_in_borough.push(event);
        }
    }
    return events_in_borough;
}

export const getEventbyDate = async (date) => {
    let response = await axios.get('https://data.cityofnewyork.us/resource/tvpp-9vvx.json');
    let data = response.data;
    let events_in_date = [];

    for (const event of data) { 
        let eventDates = event.start_date_time;
        eventDates = eventDates.split("T");

        if (eventDates[0] === date) {
            events_in_date.push(event);
        }
    }
    return events_in_date;
}


//console.log(await getEventbyDate("2024-11-27"));

//console.log(await getEventbyBorough("Queens"));

//console.log(await getAllEvents());
