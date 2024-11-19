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
    (
	    nwr["amenity"="cafe"]["internet_access"="wlan"](area.searchArea);
	    nwr["amenity"="cafe"]["internet_access"="yes"](area.searchArea);
    );
    out body;
    `;

    return await fetchFromOverpass("https://overpass-api.de/api/interpreter", query);
}