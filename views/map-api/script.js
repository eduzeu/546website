(function(window, mapster) {
  
    // map options
    const wifi_url = 'https://data.cityofnewyork.us/resource/npnk-wrj8.json';
    // FIX THIS LATER!
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];area(id:3600175905)-%3E.searchArea;node[%22amenity%22=%22cafe%22][%22internet_access%22](area.searchArea);`
    const query = `
    [out:json];
    area[name="New York City"]->.searchArea;
    node[amenity=cafe](area.searchArea);
    out;
    `;
    
    var options = mapster.MAP_OPTIONS,
    element = document.getElementById('map-canvas'),
    // map
    map = mapster.create(element, options);
  
    var marker = map.addMarker({
        lat: 40.76030326972345,
        lng:-73.99178458465607,
      content: '<div style="color: #f00;">I like food</div>'
    });
    
    var marker2 = map.addMarker({
        lat: 40.73010326975731,
        lng:-73.99778458465607,
      content: 'I like rice'
    });

    $.getJSON(wifi_url, function(data) {
        console.log(data); // Debugging output
        $.each(data, function(i, entry) {
            if (entry.latitude && entry.longitude) {
                map.addMarker({
                    lat: parseFloat(entry.latitude),
                    lng: parseFloat(entry.longitude),
                    title: entry.public_space_open_space_name || "Unnamed Location",
                    event: {
                        name: "click",
                        callback: function() {
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
            } else {
                console.warn("Missing coordinates for entry:", entry);
            }
        });
    });
    // $.getJSON(wifi_url, function(data) {
    //     console.log(data); // Debugging output
    //     $.each(data, function(i, entry) {
    //         if (entry.latitude && entry.longitude) {
    //             map.addMarker({
    //                 lat: parseFloat(entry.latitude),
    //                 lng: parseFloat(entry.longitude),
    //                 title: entry.public_space_open_space_name || "Unnamed Location",
    //                 event: {
    //                     name: "click",
    //                     callback: function() {
    //                         alert("You clicked on " + (entry.public_space_open_space_name || "Unnamed Location"));
    //                     }
    //                 },
    //                 icon: {
    //                     url: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png', // URL of the custom icon
    //                     // url: 'https://cdn-icons-png.flaticon.com/128/14090/14090489.png',
    //                     scaledSize: new google.maps.Size(32, 32), // Scaled size (width, height in pixels)
    //                     origin: new google.maps.Point(0, 0), // Origin point (0, 0 by default)
    //                     anchor: new google.maps.Point(16, 32) // Anchor point (adjust if needed)
    //                 },
    //                 content: `space type: ${entry.public_space_open_space}` // ADD THE NECESSARY THINGS HERE
    //             });
    //         } else {
    //             console.warn("Missing coordinates for entry:", entry);
    //         }
    //     });
    // });
    
    //map._removeMarker(marker2);
    
    //console.log(map.markers);
    
    var found = map.findMarkerByLat(37.781350);
    
    console.log(found);
    
  
  }(window, window.Mapster));