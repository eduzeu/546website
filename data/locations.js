import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { wifiLocationsNewYork } from "../wifi.js";
import { reviews } from "../config/mongoCollections.js";
import axios from "axios";

const db = await dbConnection();
const reviewCollection = await reviews();

export const getWifiLocations = async () => {
  let response = await axios.get("https://data.cityofnewyork.us/resource/npnk-wrj8.json");
  let data = response.data
  //console.log(data)

  let wifiInfo = {};

  for (const item of data) {
    console.log(item);
    const ssid = item['public_space_open_space_name'];
    if (!wifiInfo[ssid]) { // Only add if it doesn't exist yet
      wifiInfo[ssid] = {
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

export const createWifiReview = async (rating, text) => {

  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error("Invalid userId.");
  }

  const ratings = await reviewCollection.insertOne({
    _id: new ObjectId(),
    rating,
    text
  });

  return ratings;

};

export const getWifiReviews = async (id) => {

  const getReview = await reviewCollection.find(id).toArray();
  return getReview;
}


// console.log(await getWifiLocations()); 