import { LocalStorage } from 'node-localstorage';
import { fetchFrom, fetchFromOverpass, validateNumber } from '../helpers.js';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const localStorage = new LocalStorage('./scratch');


export let fetchCoffeeShops = async () => {
  const query = `
    [out:json];
    area(id:3600175905)->.searchArea;
    nwr["amenity"="cafe"]["internet_access"](area.searchArea);
    out body;
    `;

  const rawData = await fetchFromOverpass(query);

  // While the below filtering could be expressed in the query
  // That extends the time it takes for it to be processed
  // To reduce the waiting time, filtering is done in JS

  let filtered = rawData.elements.filter((item) => {
    return (item.tags["internet_access"] === "wlan" || item.tags["internet_access"] === "yes") && item.tags["addr:housenumber"] !== undefined && item.tags["addr:street"] !== undefined && item.tags["addr:city"] !== undefined && item.lat !== undefined && item.lon !== undefined
  })

  let results = rawData
  results.elements = filtered

  return results;
}

export const fetchCoffeeShopById = async (id) => {
  id = validateNumber(id, "Coffee Shop ID");

  const query = `
  [out:json];
  node(${id});
  out body;
  `;

  const rawData = await fetchFromOverpass(query);

  if (rawData.elements.length === 0) {
    throw `No coffee shop found with id '${id}'.`;
  }

  return rawData.elements[0];
}

export const getWifiLocations = async () => {
  let data = await fetchFrom("https://data.cityofnewyork.us/resource/npnk-wrj8.json");

  let wifiInfo = {};

  for (const item of data) {
    const ssid = item['public_space_open_space_name'];
    if (!wifiInfo[ssid]) { // Only add if it doesn't exist yet
      wifiInfo[ssid] = {
        "place_id": Number(item.oid),
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

export const deleteScratchFolder = async () => { 
  const folderPath = path.join(__dirname, '..', 'scratch');
  console.log(folderPath);

  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    console.log("files: ", files);

    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      try {
        if (fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath); // Delete file
        } else {
          fs.rmdirSync(filePath, { recursive: true });  
        }
      } catch (e) {
        console.error(e);
      }
    });
     await getPlaceOfTheDay();
  } else {
    console.log("folder does not exist.");
  }
};
setInterval(deleteScratchFolder, 24 * 60 * 60 * 1000);

export const getPlaceOfTheDay = async () => {
  const folderPath = path.join(__dirname, '..', 'scratch');
  const placeFilePath = path.join(folderPath, 'placeOfTheDay');

  let store;
  try {
    store = JSON.parse(fs.readFileSync(placeFilePath, 'utf8')); 
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('placeOfTheDay file does not exist, creating a new one.');
    } else {
      console.error('Error reading placeOfTheDay file:', err);
    }
  }

  const storeTime = localStorage.getItem('nextUpdatedTime');
  const time = Date.now();

  if (!store || (storeTime && time >= Number(storeTime))) {
    let coffeData = await fetchCoffeeShops();
    let coffeArray = Object.values(coffeData.elements);
    let random = Math.floor(Math.random() * coffeArray.length);
    let response = coffeArray[random];

    let address = response.tags['addr:housenumber']  +
                  response.tags['addr:street'] + ', ' +
                  response.tags['addr:city'] + ', ' +
                  response.tags['addr:state'] + ', ' +
                  response.tags['addr:postcode']

    let placeOfDayObject = {
      name: response.tags.name,
      address: address,
      type: response.tags.amenity,
    };

    try {
      fs.writeFileSync(placeFilePath, JSON.stringify(placeOfDayObject), 'utf8');
    } catch (err) {
      console.error('Error writing to placeOfTheDay file:', err);
    }

    localStorage.setItem('nextUpdateTime', time + 24 * 60 * 60 * 1000); 

    return placeOfDayObject;
  }

  return store;
};
