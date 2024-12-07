
// this works and is in ES6 syntax
(async (window, mapster) => {
    // map options
    const wifi_url = '/location/wifi';
    const coffee_url = '/location/coffeeShop';

    const options = mapster.MAP_OPTIONS;
    const element = document.getElementById('map-canvas');

    // map
    const map = mapster.create(element, options);

    // https://developers.google.com/maps/documentation/javascript/examples/places-searchbox#maps_places_searchbox-javascript
    // const input = document.getElementById("starting-address");
    // const search_bar = new google.maps.places.Autocomplete(input,{
    //     types: ['address'],
    //     componentRestrictions: { country: 'us'}
    // });

    // search_bar.bindTo("bounds", map);

    // search_bar.addListener("place_changed", function() {
    //     const place = search_bar.getPlace();
    //     if (!place.geometry) {
    //         console.log(`Not found`);
    //         return;
    //     }
    //     map.setCenter(place.geometry.location);
    //     map.setZoom(13);
    // });

    function initialize() {
        let input = document.getElementById('searchTextField');
        let search_bar = new google.maps.places.Autocomplete(input, {
            types: ['address'],
            componentRestrictions: { country: 'us' }
        });
        // search_bar.bindTo("bounds", map);

        const position_marker = map.addMarker({
            anchorPoint: new google.maps.Point(0, -29),
            visible: false,
            icon: {
                // url: 'https://i.imgur.com/xgIzHcA.png',
                url: 'https://cdn-icons-png.flaticon.com/512/1783/1783356.png',
                scaledSize: new google.maps.Size(30, 30), // Scaled size (width, height in pixels)
                origin: new google.maps.Point(0, 0), // Origin point (0, 0 by default)
                anchor: new google.maps.Point(16, 32) // Anchor point (adjust if needed)
            }
        });


        search_bar.addListener("place_changed", () => {
            // console.log("place changed!");
            const place = search_bar.getPlace();
            console.log(`The place gotten is: `);
            console.log(place);

            if (!place.geometry) {
                console.log(`Not found`);
                return;
            }

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            console.log(`lat: ${lat}, lng: ${lng}.`);

            map.gMap.setCenter({ lat: lat, lng: lng });
            map.gMap.setZoom(13);
            position_marker.setPosition({ lat: lat, lng: lng });
            position_marker.setVisible(true);
        });
    }

    google.maps.event.addDomListener(window, 'load', initialize);

    // const radiusCircle = google.maps.Circle({
    //     strokeColor: "##85beff",
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: "##85beff",
    //     fillOpacity: 0.35,
    //     map,
    //     center: citymap[city].center,
    //     // radius is in meters apparently so multiply the miles by 1609.34
    //     radius: Math.sqrt(citymap[city].population) * 100,
    // });

    window.radiusSubmit = function() {
        const selectedRadius = document.getElementById('radius');
        const radiusValue = radiusSelect.value;
        console.log('Radius selected:', radiusValue + ' miles');
    }


    let wifi_markers = [];
    let coffee_markers = [];

    document.getElementById('wifi-checkbox').addEventListener('change', async function () {
        if (this.checked) {
            coffee_markers.forEach(marker => {
                map._removeMarker(marker);
            });
            coffee_markers = [];
            try {
                console.log("Fetching WiFi data...");
                const response = await fetch(wifi_url);
                const data = await response.json();
                console.log("WiFi data fetched successfully:", data);

                const wifi_entries = Object.values(data);

                wifi_entries.forEach(entry => {
                    if (entry.Latitude && entry.Longitude) {
                        let marker = map.addMarker({
                            lat: parseFloat(entry.Latitude),
                            lng: parseFloat(entry.Longitude),
                            title: entry['Wifi name'] || "Unnamed Location",
                            // FIX EVENT
                            // event: {
                            //     name: "click",
                            //     callback: function () {
                            //         alert("You clicked on " + (entry['Wifi name'] || "Unnamed Location"));
                            //     }
                            // },
                            icon: {
                                // url: 'https://i.imgur.com/xgIzHcA.png',
                                url: 'https://i.imgur.com/pDk8HOg.png',
                                scaledSize: new google.maps.Size(28, 34), // Scaled size (width, height in pixels)
                                origin: new google.maps.Point(0, 0), // Origin point (0, 0 by default)
                                anchor: new google.maps.Point(16, 32) // Anchor point (adjust if needed)
                            },
                            // content: `Name: ${entry['Wifi name']}, Place: ${entry.Place}, Neighborhood: ${entry.Neighborhood}` // ADD THE NECESSARY THINGS HERE
                            content:
                                `<div>
                                <strong>Name:</strong> ${entry['Wifi name'] || "Unnamed Wifi Location"}<br>
                                <strong>Place:</strong> ${entry.Place || "No place provided"}<br>
                                <strong>Neighborhood:</strong> ${entry.Neighborhood || "No neighborhood provided"}<br>
                            </div>`
                        });
                        wifi_markers.push(marker);
                    } else {
                        console.warn("Missing coordinates for entry:", entry);
                    }
                });
            }
            catch (error) {
                console.error("Error fetching WiFi locations:", error);
            }
        }
        else {
            wifi_markers.forEach(marker => {
                map._removeMarker(marker);
            });
            wifi_markers = [];
        }
    });
    document.getElementById('coffee-checkbox').addEventListener('change', async function () {
        if (this.checked) {
            wifi_markers.forEach(marker => {
                map._removeMarker(marker);
            });
            wifi_markers = [];
            try {
                console.log("Fetching Coffee Shop data...");
                const response = await fetch(coffee_url);
                const data = await response.json();
                console.log("Coffee Shop data fetched successfully:", data);
                data.elements.forEach(entry => {
                    if (entry.lat && entry.lon) {
                        let marker = map.addMarker({
                            lat: parseFloat(entry.lat),
                            lng: parseFloat(entry.lon),
                            title: entry.tags.name || "Unnamed Coffee Shop",
                            // TODO: FIX EVENT
                            // event: {
                            //     name: "click",
                            //     callback: function () {
                            //         alert("You clicked on " + (entry.tags.name || "Unnamed Coffee Shop"));
                            //     }
                            // },
                            icon: {
                                // url: 'https://i.imgur.com/Q0lGgUU.png',
                                url: 'https://i.imgur.com/CU43Ymm.png',
                                scaledSize: new google.maps.Size(28, 34), // Scaled size (width, height in pixels)
                                origin: new google.maps.Point(0, 0), // Origin point (0, 0 by default)
                                anchor: new google.maps.Point(16, 32) // Anchor point (adjust if needed)
                            },
                            content:
                                `<div>
                                <strong>Name:</strong> ${entry.tags.name || "Unnamed Coffee Shop"}<br>
                                <strong>Address:</strong> ${entry.tags["addr:street"] || "No address provided"}<br>
                                <a href="/coffeeShop/${entry.id}" target="_blank">View Details</a>
                            </div>`
                            // content: `Name: ${entry.tags.name}, Address: ${entry.tags["addr:street"] || "No address provided"}` // ADD THE NECESSARY THINGS HERE
                        });
                        coffee_markers.push(marker);
                    } else {
                        console.warn("Missing coordinates for entry:", entry);
                    }
                });
            } catch (error) {
                console.error("Error fetching Coffee Shop locations:", error);
            }
        }
        else {
            coffee_markers.forEach(marker => {
                map._removeMarker(marker);
            });
            coffee_markers = [];
        }
    });

})(window, window.Mapster);
