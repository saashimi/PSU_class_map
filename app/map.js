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

map.on('load', function() {
  map.addSource("sched_points", {
    "type": "geojson",
    "data": "https://cdn.glitch.com/f385be6b-3d08-4de8-899d-247058842c55%2Ffull_sched.geojson?1502663523957",
  });
  
  var dayLayer = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var colLayer = ["red", "green", "blue", "orange", "gray", "purple"];
  
  for (var i=0; i<dayLayer.length; i++) {
    map.addLayer({
      "id" : dayLayer[i],
      "type" : "circle",
      "source": "sched_points",
      'paint': {
        'circle-radius': 4,
        'circle-color': colLayer[i]  
      }
    });
    map.setFilter(dayLayer[i], ["!=", "Day_start_"+dayLayer[i][0], "na"]);
  }    
})


for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };
  
    var layers = document.getElementById('menu');
    layers.appendChild(link);
}
