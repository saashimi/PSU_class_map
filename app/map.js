/* global mapboxgl */


mapboxgl.accessToken = "pk.eyJ1Ijoia3NhYXZlZHJhIiwiYSI6ImNpam45bG1lbDAwZWx2YWx4aHVjOXZwMTEifQ.Xt258Ze2kA28j8wnC8LtLg" 
var filterGroup = document.getElementById("filter-group");
var filters = document.getElementById("filters");

var map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/mapbox/light-v9", // stylesheet location
    center: [-122.682357, 45.508532], // starting position [lng, lat]
    zoom: 14, // starting zoom
})
var toggleableLayerIds = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var days = {"Mon": "mon",
            "Tue": "tue",
            "Wed": "wed",
            "Thu": "thu",
            "Fri": "fri",
            "Sat": "sat"}

map.on("load", function() {
  
  map.addSource("PSU_buildings", {
    "type": "geojson",
    "data": "data/PSU_buildings.geojson",
  });

  map.addLayer({
    "id": "buildings",
    "source": "PSU_buildings",
    "type": "fill",
    "paint": {
      "fill-color": "gray",
      "fill-opacity": .5
    }
  })

  map.addSource("PSU_full_schedule", {
    "type": "geojson",
    "data": "data/PSU_full_schedule.geojson",
  });
  map.addLayer({
    "id": "classes",
    "type": "circle",
    "source": "PSU_full_schedule",
    "paint": {
      "circle-radius": {
        property: "Actual_Enrl",
        stops: [
          [2,    3],
          [170,  8],
          [360,  15],
          [710,  20],
          [1100, 30]
        ]
    },
    "circle-color": {
      property: "Actual_Enrl",
      stops: [
        [2, "#2DC4B2"],
        [60, "#3BB3C3"],
        [170, "#669EC4"],
        [360, "#8B88B6"],
        [710, "#A2719B"],
        [1100, "#AA5E79"]
      ]
    },
    "circle-opacity": 0.8     
    },
    filter: ["==", "Start_Time", 6]
  }) ;

  document.getElementById("slider").addEventListener("input", function(e) {
  // get the current hour as an integer
  var hour = parseInt(e.target.value);
  // map.setFilter(layer-name, filter)
  map.setFilter("classes", ["==", "Start_Time", hour]);

  // converting 0-23 hour to AMPM format
  var ampm = hour >= 12 ? "PM" : "AM";
  var hour12 = hour % 12 ? hour % 12 : 12;
  // update text in the UI
  document.getElementById("active-hour").innerText = hour12 + ampm;
  });

});


