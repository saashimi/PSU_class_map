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
  for (var i=0; i<toggleableLayerIds.length; i++) {
    console.log("data/" + days[toggleableLayerIds[i]]  + ".geojson");
    map.addSource(days[toggleableLayerIds[i]], {
      "type": "geojson",
      "data": "data/" + days[toggleableLayerIds[i]]  + ".geojson",
      "cluster": true
    });
    var collayer = [
          [5, 'green'],
          [20, 'orange'],
          [200, 'red']
      ];

  collayer.forEach(function (layer, j) {
      map.addLayer({
          "id": toggleableLayerIds[i] + j,
          "type": "circle",
          "source": days[toggleableLayerIds[i]],
          "paint": {
              "circle-color": layer[1],
              "circle-radius": 70,
              "circle-blur": 1 // blur the circles to get a heatmap look
          },
          "filter": j === collayer.length - 1 ?
              [">=", "point_count", layer[0]]:
              ["all",
                  [">=", "point_count", layer[0]],
                  ["<", "point_count", collayer[j + 1][0]]]
      }, 'waterway-label' );

  });

  map.addLayer({
      "id": toggleableLayerIds[i],
      "type": "circle",
      "source": days[toggleableLayerIds[i]],
      "paint": {
          "circle-color": 'rgba(0,255,0,0.5)',
          "circle-radius": 20,
          "circle-blur": 1
      },
      "filter": ["!=", "cluster", true]
  }, 'waterway-label');

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


function build_heatMap(clickLayer) {
  

} 