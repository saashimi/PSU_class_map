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
var filterHour = ["==", "Hr_6", "TRUE"];
var filterDay = ['==', 'Day_M', "TRUE"];

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
        [2, "#ffffb2"],
        [60, "#fed976"],
        [170, "#feb24c"],
        [360, "#fd8d3c"],
        [710, "#f03b20"],
        [1100, "#bd0026"]
      ]
    },
    "circle-opacity": 0.8     
    },
    filter: ["all", filterHour, filterDay]
  }) ;

  document.getElementById("slider").addEventListener("input", function(e) {
  // get the current hour as an integer
  var hour = parseInt(e.target.value);
  // map.setFilter(layer-name, filter)
  if (hour === 6) {
    filterHour = ["==", "Hr_6", "TRUE"];
  } else if (hour === 7) {
    filterHour = ["==", "Hr_7", "TRUE"];
  } else if (hour === 8) {
    filterHour = ["==", "Hr_8", "TRUE"];     
  } else if (hour === 9) {
    filterHour = ["==", "Hr_9", "TRUE"];  
  } else if (hour === 10) {
    filterHour = ["==", "Hr_10", "TRUE"];
  } else if (hour === 11) {
    filterHour = ["==", "Hr_11", "TRUE"];     
  } else if (hour === 12) {
    filterHour = ["==", "Hr_12", "TRUE"]; 
  } else if (hour === 13) {
    filterHour = ["==", "Hr_13", "TRUE"];
  } else if (hour === 14) {
    filterHour = ["==", "Hr_14", "TRUE"];     
  } else if (hour === 15) {
    filterHour = ["==", "Hr_15", "TRUE"]; 
  } else if (hour === 16) {
    filterHour = ["==", "Hr_16", "TRUE"];
  } else if (hour === 17) {
    filterHour = ["==", "Hr_17", "TRUE"];     
  } else if (hour === 18) {
    filterHour = ["==", "Hr_18", "TRUE"]; 
  } else if (hour === 19) {
    filterHour = ["==", "Hr_19", "TRUE"]; 
  } else if (hour === 20) {
    filterHour = ["==", "Hr_20", "TRUE"]; 
  } else if (hour === 21) {
    filterHour = ["==", "Hr_21", "TRUE"];
  } else if (hour === 22) {
    filterHour = ["==", "Hr_22", "TRUE"];     
  } else if (hour === 23) {
    filterHour = ["==", "Hr_23", "TRUE"]; 
  } else {
    console.log('error');
  }
  map.setFilter("classes", ["all", filterHour, filterDay]);

  // converting 0-23 hour to AMPM format
  var ampm = hour >= 12 ? "PM" : "AM";
  var hour12 = hour % 12 ? hour % 12 : 12;
  // update text in the UI
  document.getElementById("active-hour").innerText = hour12 + ampm;
  });
  
  document.getElementById("filters").addEventListener("change", function(e) {
    var day = e.target.value;
    if (day === "Mon") {
      filterDay = ["==", "Day_M", "TRUE"];
    } else if (day === "Tue") {
      filterDay = ["==", "Day_T", "TRUE"];
    } else if (day === "Wed") {
      filterDay = ["==", "Day_W", "TRUE"];
    } else if (day === "Thu") {
      filterDay = ["==", "Day_R", "TRUE"];
    } else if (day === "Fri") {
      filterDay = ["==", "Day_F", "TRUE"];
    } else if (day === "Sat") {
      filterDay = ["==", "Day_S", "TRUE"];      
    } else {
      console.log("error");
    }
    map.setFilter("classes", ["all", filterHour, filterDay]);
  });


});


