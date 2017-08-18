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

  for (var i=0; i<toggleableLayerIds.length; i++) {
    map.addSource(days[toggleableLayerIds[i]], {
      "type": "geojson",
      "data": "data/" + days[toggleableLayerIds[i]]  + ".geojson",
      "cluster": true
    });
    map.addLayer({
      "id": "buildings",
      "source": "PSU_buildings",
      "type": "fill",
      "paint": {
        "fill-color": "gray",
        "fill-opacity": .1
      }
    })

    var collayer = [
          [5, 'green'],
          [25, 'orange'],
          [200, 'red']
      ];

    var groupLayer = [];

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
        groupLayer.push(toggleableLayerIds[i] + j)

    });

    map.addLayer({
        "id": toggleableLayerIds[i] + "-pt",
        "type": "circle",
        "source": days[toggleableLayerIds[i]],
        "paint": {
            "circle-color": 'rgba(0,255,0,0.5)',
            "circle-radius": 20,
            "circle-blur": 1
        },
        "filter": ["!=", "cluster", true]
    }, 'waterway-label');
  groupLayer.push(toggleableLayerIds[i] + "-pt")
  toggleLayer(groupLayer, toggleableLayerIds[i])

  }
  console.log(map.getStyle().layers)
})

function toggleLayer(ids, name) {
      var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.textContent = name; //changed from id

      link.onclick = function (e) {
          //var clickedLayer = this.textContent;
          e.preventDefault();
          e.stopPropagation();
          for (layers in ids) {
            var visibility = map.getLayoutProperty(ids[layers], 'visibility');

            if (visibility === 'visible') {
                map.setLayoutProperty(ids[layers], 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(ids[layers], 'visibility', 'visible');
            }
          }
      };
    
      var layers = document.getElementById('menu');
      layers.appendChild(link);
}

function filterBy(time) {
  var filters = ['==', '']
}