import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import {wifiLocations as callWifi} from "../config/mongoCollections.js"
import { wifiLocationsNewYork } from "../wifi.js";

const db = await dbConnection();
const teamCollection = await callWifi();


export const addWifiLocations = async () => {

  //check if database contains the wifi locations to not add them again;
  const collections = await db.listCollections({
    name: "wifi"
  }).toArray();

  if(collections.length  > 0){
    return;
  }else{
    for(let i = 0; i < wifiLocationsNewYork.length; i++){
      const location = wifiLocationsNewYork[i];
      await teamCollection.insertOne({
        ...location, 
        _id: new ObjectId(),
      });
      //console.log(`Inserted document`);
    }
    return "successfully added the Wifi locations";
  }
  
};

await addWifiLocations();

export const getWifiLocations = async () => {

  const collection = db.collection("wifi");

  const items = collection.find({});
  
  let wifiInfo = {};
  let count= 0;
 
  await items.forEach(item => {
      const ssid = item['Public Space (Open Space) Name'];  
      count++;
      if (!wifiInfo[ssid]) {  // Only add if it doesn't exist yet
        wifiInfo[ssid] = {
          'Wifi name': item['SSID'],
          'Place': item['Borough Name'],
          'Neighborhood': item['Neighborhood Tabulation Area Name (NTA NAME)'],
          'Latitude': item.Latitude,
          'Longitude': item.Longitude
        };
      }
    });
  return wifiInfo;
};

//  console.log(await getWifiLocations()); 