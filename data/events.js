import axios from 'axios'; 
import { response } from 'express';

export const getAllEvents = async ()=> {
    let response = await axios.get(`https://data.cityofnewyork.us/resource/tvpp-9vvx.json`);
    let data = response.data
    let results = []

    const now = new Date();

    let curr = now.toISOString();  //to manipluate as date as a string
    curr = curr.split("T");        
    curr = curr[0].split("-"); 
    
    for (const event of data) {
        if(results.length >= 50){
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

        if(eventDateTime >= currentDateTime){
            event.start_date_time = formattedDate + " Time: " + time[0]+":"+ time[1]
            results.push(event);
        }
    }
    return results 
}

export const getEventbyBorough = async (city) => {
    let response = await axios.get('https://data.cityofnewyork.us/resource/tvpp-9vvx.json');
    let data = response.data;
    let events_in_borough = [];

    const now = new Date();

    let curr = now.toISOString();  //to manipluate as date as a string
    curr = curr.split("T");        
    curr = curr[0].split("-");     

    for (const event of data) {
        if(events_in_borough.length >= 50){
            break;
        }

        if (event.event_borough === city) {
            let eventDates = event.start_date_time;
            let time = eventDates.split("T");

            eventDates = time[0]
            time = time[1].split(":"); 
            eventDates = eventDates.split("-");

            let formattedDate = eventDates[1] + "/" + eventDates[2] + "/" + eventDates[0];

            const eventDateTime = new Date(eventDates[0], eventDates[1] - 1, eventDates[2]);
            const currentDateTime = new Date(curr[0], curr[1] - 1, curr[2]);

            if(eventDateTime >= currentDateTime){
                event.start_date_time = formattedDate + " Time: " + time[0]+":"+ time[1]
                events_in_borough.push(event);
            }
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
