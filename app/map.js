/* global mapboxgl */


mapboxgl.accessToken = 'pk.eyJ1Ijoia3NhYXZlZHJhIiwiYSI6ImNpam45bG1lbDAwZWx2YWx4aHVjOXZwMTEifQ.Xt258Ze2kA28j8wnC8LtLg' 
var filterGroup = document.getElementById('filter-group');
var filters = document.getElementById('filters')

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
    center: [-122.682357, 45.508532], // starting position [lng, lat]
    zoom: 14, // starting zoom
})
var toggleableLayerIds = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var days = {"Mon": 'mon',
            "Tue": 'tue',
            "Wed": 'wed',
            "Thu": 'thu',
            "Fri": 'fri',
            "Sat": 'sat'}

map.on('load', function() {
  
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

  for (var i=0; i<1; i++) {
  //for (var i=0; i<toggleableLayerIds.length; i++) {

    map.addSource(days[toggleableLayerIds[i]], {
      "type": "geojson",
      "data": "data/" + days[toggleableLayerIds[i]]  + ".geojson",
      //"cluster": true
    });
    //temp for visualization
    map.addLayer({
      "id": toggleableLayerIds[i],
      "type": "circle",
      "source": days[toggleableLayerIds[i]],
      "paint": {
        'circle-radius': {
          property: 'Actual_Enrl',
          stops: [
            [5, 1],
            [25, 3],
            [50, 8],
            [100, 15]
          ]
      },
      'circle-color': {
        property: 'Actual_Enrl',
        stops: [
          [5, '#2DC4B2'],
          [10, '#3BB3C3'],
          [25, '#669EC4'],
          [50, '#8B88B6'],
          [75, '#A2719B'],
          [150, '#AA5E79']
        ]
      },
      'circle-opacity': 0.8     
      },
    });

    //end temp viz layer
    document.getElementById('slider').addEventListener('input', function(e) {
    // get the current hour as an integer
    var hour = parseInt(e.target.value);
    // map.setFilter(layer-name, filter)

    map.setFilter('Mon', ['==', 'Day_start', hour]);

    // converting 0-23 hour to AMPM format
    var ampm = hour >= 12 ? 'PM' : 'AM';
    var hour12 = hour % 12 ? hour % 12 : 12;
    // update text in the UI
    document.getElementById('active-hour').innerText = hour12 + ampm;
    });
  
  }



    console.log(map.getStyle().layers)

});


