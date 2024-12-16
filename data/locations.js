import { LocalStorage } from 'node-localstorage';
import { fetchFrom, fetchFromOverpass, validateNumber } from '../helpers.js';

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

export const getPlaceOfTheDay = async () => {
  let store = JSON.parse(localStorage.getItem("placeOfTheDay"));
  let storeTime = localStorage.getItem("nextUpdatedTime");
  const time = Date.now();

  if (!store || time >= storeTime) {
    let wifiObject = await fetchCoffeeShops();
    let wifiArray = Object.values(wifiObject);
    let random = Math.floor(Math.random() * wifiArray.length);
    let response = wifiArray[random];

    localStorage.setItem('placeOfTheDay', JSON.stringify(response));
    localStorage.setItem('nextUpdateTime', time + 24 * 60 * 60 * 1000);

    return response;

  }

  return store;

};

export const getWiFiLocationNames = async () => {
  const data = await fetchFrom("https://data.cityofnewyork.us/resource/npnk-wrj8.json?$select=public_space_open_space_name, min(oid)&$group=public_space_open_space_name&$order=public_space_open_space_name asc");

  const output = data.map((item) => {
    return {
      "oid": Number(item.min_oid),
      'public_space_open_space_name': item.public_space_open_space_name
    };
  });

  return output;
}

// (async () => {
//   console.log(await getPlaceOfTheDay());
// })();