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

map.on('load', function() {
  map.addSource("sched_points", {
    type: "geojson",
    cluster: true,
    data: "https://cdn.glitch.com/f385be6b-3d08-4de8-899d-247058842c55%2Ffull_sched.geojson?1502663523957",
    clusterMaxZoom: 15, // Max zoom to cluster points on
    clusterRadius: 20 // Use small cluster radius for the heatmap look
  });
  
  var dayLayer = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var colLayer = ["red", "green", "blue", "orange", "gray", "purple"];
  
   var layers = [
        [5, 'green'],
        [20, 'orange'],
        [200, 'red']
    ];

    layers.forEach(function (layer, i) {
        map.addLayer({
            "id": "cluster-" + i,
            "type": "circle",
            "source": "sched_points",
            "paint": {
                "circle-color": layer[1],
                "circle-radius": 70,
                "circle-blur": 1 // blur the circles to get a heatmap look
            },
            "filter": i === layers.length - 1 ?
                [">=", "point_count", layer[0]] :
                ["all",
                    [">=", "point_count", layer[0]],
                    ["<", "point_count", layers[i + 1][0]]]
        }, 'waterway-label' );
    });

    map.addLayer({
        "id": "unclustered-points",
        "type": "circle",
        "source": "sched_points",
        "paint": {
            "circle-color": 'rgba(0,255,0,0.5)',
            "circle-radius": 20,
            "circle-blur": 1
        },
        "filter": ["!=", "cluster", true]
    }, 'waterway-label');
      
})

