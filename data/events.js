import axios from 'axios'; 
import { response } from 'express';

export const getAllEvents = async ()=> {
    let response = await axios.get(`https://data.cityofnewyork.us/resource/tvpp-9vvx.json`);

    let data = response.data

    let results = []
    

    for (const event of data) {
        if(results.length >= 50){
            break;
        }
        let eventDates = event.start_date_time;
        eventDates = eventDates.split("T");

        eventDates = eventDates[0]
        eventDates = eventDates.split("-");

        eventDates = eventDates[1] +"/"+ eventDates[2] +"/"+ eventDates[0] 
        event.start_date_time = eventDates

        results.push(event);
        
    }
    
    return results 
}

export const getEventbyBorough = async (city) => {
    let response = await axios.get('https://data.cityofnewyork.us/resource/tvpp-9vvx.json');
    let data = response.data;
    let events_in_borough = [];

    for (const event of data) {
        if(events_in_borough.length >= 50){
            break;
        }

        if (event.event_borough === city) {
            let eventDates = event.start_date_time;
            eventDates = eventDates.split("T");

            eventDates = eventDates[0]
            eventDates = eventDates.split("-");

            eventDates = eventDates[1] +"/"+ eventDates[2] +"/"+ eventDates[0] 
            event.start_date_time = eventDates


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
        if(events_in_date.length >= 50){
            break;
        }

        let eventDates = event.start_date_time;
        eventDates = eventDates.split("T");

        eventDates = eventDates[0]
        eventDates = eventDates.split("-");

        eventDates = eventDates[1] +"/"+ eventDates[2] +"/"+ eventDates[0] 
        

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
