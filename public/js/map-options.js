/**
 * to convert to ES6 syntax: 
 * 1. function declaration 
 * 2. get rid of var -> const | let
 * 3. arrow funcitons
 * */

// this works and is in ES6 syntax

(async (window, google, mapster) => {
  
    mapster.MAP_OPTIONS = {
      center: {
        lat: 40.74863940474718,
        lng: -73.98568893470194
      },
      zoom: 13,
      disableDefaultUI: false,
      scrollwheel: true,
      draggable: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
        style: google.maps.ZoomControlStyle.DEFAULT
      },
      panControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    };
  })(window, google, window.Mapster || (window.Mapster = {}))