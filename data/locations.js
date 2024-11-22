import * as helpers from "../helpers.js";

export let fetchCoffeeShops = async () => {
  const query = `
    [out:json];
    area(id:3600175905)->.searchArea;
    nwr["amenity"="cafe"]["internet_access"](area.searchArea);
    out body;
    `;

  const rawData = await helpers.fetchFromOverpass(query);

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
  id = helpers.validateNumber(id);

  const query = `
  [out:json];
  node(${id});
  out body;
  `;

  const rawData = await helpers.fetchFromOverpass(query);

  if (rawData.elements.length === 0) {
    throw `No coffee shop found with id '${id}'.`;
  }

  return rawData.elements[0];
}

export const getWifiLocations = async () => {
  let data = await helpers.fetch("https://data.cityofnewyork.us/resource/npnk-wrj8.json");

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