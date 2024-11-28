/**
 * to convert to ES6 syntax: 
 * 1. function declaration 
 * 2. get rid of var -> const | let
 * 3. arrow funcitons
 * 4. use constructor and class 
 * */

// this works and is in ES6 syntax

(async (window, google) => {

  class Mapster {
    constructor(element, opts) {
      this.gMap = new google.maps.Map(element, opts);
      this.markers = [];
    }
    zoom(level) {
      if (level) {
        this.gMap.setZoom(level);
      } else {
        return this.gMap.getZoom();
      }
    }
    _on({obj,event,callback}) {
      google.maps.event.addListener(obj, event, (e)=>callback.call(this, e));
    }
    addMarker(opts) {
      opts.position = {
        lat: opts.lat,
        lng: opts.lng
      }
      const marker = this._createMarker(opts);
      this._addMarker(marker);
      if (opts.event) {
        this._on({
          obj: marker,
          event: opts.event.name,
          callback: opts.event.callback
        });
      }
      if (opts.content) {
        this._on({
          obj: marker,
          event: 'click',
          callback: () => {
            const infoWindow = new google.maps.InfoWindow({
              content: opts.content
            });

            infoWindow.open(this.gMap, marker);
          }
        })
      }
      return marker;
    }
    _addMarker(marker) {
      this.markers.push(marker);
    }
    _removeMarker(marker) {
      const indexOf = this.markers.indexOf(marker);
      if (indexOf !== -1) {
        this.markers.splice(indexOf, 1);
        marker.setMap(null);
      }
    }
    findMarkerByLat(lat) {
      return this.markers.find(marker => marker.position.lat() === lat);
    }

    // trying finding by lat and long so i can remove marker
    findMarkerByLatLong(lat, lng) {
      return this.markers.find(marker => marker.position.lat() === lat && marker.position.lng() === lng);
    }
    _createMarker(opts) {
      opts.map = this.gMap;
      return new google.maps.Marker(opts);
    }
    static create(element, opts) {
      return new Mapster(element, opts);
    }
  }
  window.Mapster = Mapster;
})(window,google);
