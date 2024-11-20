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