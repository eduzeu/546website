
/**
 * to convert to ES6 syntax: 
 * 1. function declaration 
 * 2. get rid of var -> const | let
 * 3. arrow funcitons
 * 4. use fetch 
 * */

// this works and is in ES6 syntax

// import { getWifiLocations , fetchCoffeeShops } from "../../data/locations.js";

// const wifiLocations = await getWifiLocations();
// const coffeeLocations = await fetchCoffeeShops();

(async (window, mapster) => {
    // map options
    const wifi_url = 'https://data.cityofnewyork.us/resource/npnk-wrj8.json';

    const options = mapster.MAP_OPTIONS;
    const element = document.getElementById('map-canvas');
    // map
    const map = mapster.create(element, options);

    let wifi_markers = [];
    let coffee_markers = [];

    document.getElementById('wifi-checkbox').addEventListener('change', async function () {
        if (this.checked) {
            try {
                const response = await fetch(wifi_url);
                const data = await response.json();
                data.forEach(entry => {
                    if (entry.latitude && entry.longitude) {
                        let marker = map.addMarker({
                            lat: parseFloat(entry.latitude),
                            lng: parseFloat(entry.longitude),
                            title: entry.public_space_open_space_name || "Unnamed Location",
                            event: {
                                name: "click",
                                callback: function () {
                                    alert("You clicked on " + (entry.public_space_open_space_name || "Unnamed Location"));
                                }
                            },
                            icon: {
                                // url: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', // URL of the custom icon
                                url: 'https://cdn-icons-png.flaticon.com/128/14090/14090489.png',
                                scaledSize: new google.maps.Size(32, 32), // Scaled size (width, height in pixels)
                                origin: new google.maps.Point(0, 0), // Origin point (0, 0 by default)
                                anchor: new google.maps.Point(16, 32) // Anchor point (adjust if needed)
                            },
                            content: `space type: ${entry.public_space_open_space}` // ADD THE NECESSARY THINGS HERE
                        });
                        wifi_markers.push(marker);
                    } else {
                        console.warn("Missing coordinates for entry:", entry);
                    }
                });
            }
            catch(error)
            {
                console.error("Error fetching WiFi locations:", error);
            }
        }
        else
        {
            wifi_markers.forEach(marker => {
                map._removeMarker(marker);
            });
            wifi_markers = [];
        }
    });
    document.getElementById('coffee-checkbox').addEventListener('change', async function () {
        if (this.checked) {
            try
            {
                const response = await fetch(wifi_url);
                const data = await response.json();
                data.forEach(entry => {
                    if (entry.latitude && entry.longitude) {
                        let marker = map.addMarker({
                            lat: parseFloat(entry.latitude),
                            lng: parseFloat(entry.longitude),
                            title: entry.public_space_open_space_name || "Unnamed Location",
                            event: {
                                name: "click",
                                callback: function () {
                                    alert("You clicked on " + (entry.public_space_open_space_name || "Unnamed Location"));
                                }
                            },
                            icon: {
                                // url: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', // URL of the custom icon
                                url: 'https://cdn-icons-png.flaticon.com/128/14090/14090489.png',
                                scaledSize: new google.maps.Size(32, 32), // Scaled size (width, height in pixels)
                                origin: new google.maps.Point(0, 0), // Origin point (0, 0 by default)
                                anchor: new google.maps.Point(16, 32) // Anchor point (adjust if needed)
                            },
                            content: `space type: ${entry.public_space_open_space}` // ADD THE NECESSARY THINGS HERE
                        });
                        wifi_markers.push(marker);
                    } else {
                        console.warn("Missing coordinates for entry:", entry);
                    }
                });
            }catch(error)
            {
                console.error("Error fetching WiFi locations:", error);
            }
        }
        else
        {
            wifi_markers.forEach(marker => {
                map._removeMarker(marker);
            });
            wifi_markers = [];
        }
    });

})(window, window.Mapster);