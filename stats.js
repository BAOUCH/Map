const map1 = L.map('map1').setView([31.7917, -7.0926], 5); // Position initiale

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '© OpenStreetMap'
}).addTo(map1);

const bounds = L.geoJSON(ecosurf).getBounds(); // Utiliser les polygones pour obtenir les limites
map1.fitBounds(bounds);

function getColor(d) {
    return d > 500000 ? '#800026' :
           d > 750000  ? '#BD0026' :
           d > 50000  ? '#E31A1C' :
           d > 25000  ? '#FC4E2A' :
           d > 10000   ? '#FD8D3C' :
           d > 5000   ? '#FEB24C' :
           d > 2500   ? '#FED976' :
                      '#FFEDA0';
}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.Surface),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.9
    };
}

L.geoJson(ecosurf, {style: style}).addTo(map1);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();

}
function resetHighlight(e) {
    geojson.resetStyle(e.target);
}



function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(ecosurf, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map1);




var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map1) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 2500, 5000, 10000, 25000, 50000, 750000, 500000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map1);