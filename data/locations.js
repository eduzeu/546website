import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { wifiLocationsNewYork } from "../wifi.js";
import { reviews } from "../config/mongoCollections.js";
import axios from "axios";

const fetchFromOverpass = async (url, query) => {
    try {
        let { data } = await axios.post(url, query);
        return data
    } catch (e) {
        if (e.code === 'ENOTFOUND')
            throw 'Error: Invalid URL';
        else if (e.response)
            throw `Error: ${e.response.status}: ${e.response.statusText}`;
        else
            throw `Error: ${e}`;
    }
}

export let fetchCoffeeShops = async () => {
    const query = `
    [out:json];
    area(id:3600175905)->.searchArea;
    nwr["amenity"="cafe"]["internet_access"](area.searchArea);
    out body;
    `;

    const rawData = await fetchFromOverpass("https://overpass-api.de/api/interpreter", query);

    // While the below filtering could be expressed in the query
    // That extends the time it takes for it to be processed
    // To reduce the waiting time, filtering is done in JS

    let filteredByWiFi = rawData.elements.filter((item) => {
        return item.tags["internet_access"] === "wlan" || item.tags["internet_access"] === "yes"
    })

    let filteredByLocationInfo = filteredByWiFi.filter((item) => {
        return item.tags["addr:housenumber"] !== undefined && item.tags["addr:street"] !== undefined && item.tags["addr:city"] !== undefined
    })

    let results = rawData
    results.elements = filteredByLocationInfo

    return results;
}

// console.log(await fetchCoffeeShops());

const db = await dbConnection();
const reviewCollection = await reviews();

export const getWifiLocations = async () => {
  let response = await axios.get("https://data.cityofnewyork.us/resource/npnk-wrj8.json");
  let data = response.data
 // console.log(data)

  let wifiInfo = {};

  for (const item of data) {
   // console.log(item);

 
    const ssid = item['public_space_open_space_name'];
    if (!wifiInfo[ssid]) { // Only add if it doesn't exist yet
      wifiInfo[ssid] = {
        "place_id": item.oid,
        'Wifi name': item.ssid,
        'Place': item.borough_name,
        'Neighborhood': item.neighborhood_tabulation_area_1,
        'Latitude': item.latitude,
        'Longitude': item.longitude,
      };
    }
  }
 return wifiInfo;
};

//console.log(await getWifiLocations());

export const createWifiReview = async (rating, text,id) => {

  //console.log("data validated");
  const db = await dbConnection();

  const collections = await db.listCollections().toArray();
  const names = collections.map((collection) => collection.name);

  if(!names.includes("reviews")){
    await db.createCollection("reviews");
  }

  const reviewCollection = await reviews();
  const existingReview = await reviewCollection.findOne({ id });

  if (existingReview) {
    const updatedResult = await reviewCollection.updateOne(
      { id },
      {
        $push: {
          rating: rating,
          text: text    
        }
      }
    );
    return updatedResult;
  } else {
    const newReview = await reviewCollection.insertOne({
      _id: new ObjectId(),
      rating: [rating],   
      text: [text],
      id                  
    });
    return newReview;
  }
};

export const getWifiReviews = async () => {
  try {
    const reviewsList = await reviewCollection.find().toArray();
    return reviewsList;
  } catch (error) {
    throw new Error('Failed to fetch Wi-Fi reviews');
  }
};
 
//console.log(await createWifiReview(2, "liked it", "15"));
//console.log(await createWifiReview(5, "good place")); 