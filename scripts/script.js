// ============================================================
// scripts/script.js — Clone exato do gtamap.xyz (deobfuscado)
// ============================================================

var center_x = 117.3;
var center_y = 172.8;
var scale_x = 0.02072;
var scale_y = 0.0205;

// CRS customizado para GTA V (idêntico ao original)
var CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,
    scale: function(zoom) {
        return Math.pow(2, zoom);
    },
    zoom: function(scale) {
        return Math.log(scale) / 0.6931471805599453;
    },
    distance: function(latlng1, latlng2) {
        var dx = latlng2.lng - latlng1.lng;
        var dy = latlng2.lat - latlng1.lat;
        return Math.sqrt(dx * dx + dy * dy);
    },
    transformation: new L.Transformation(scale_x, center_x, -scale_y, center_y),
    infinite: true
});

// Camadas de tiles
var SateliteStyle = L.tileLayer('mapStyles/styleSatelite/{z}/{x}/{y}.jpg', {
    minZoom: 0,
    maxZoom: 8,
    noWrap: true,
    continuousWorld: false,
    attribution: 'www.gtamap.xyz',
    id: 'SateliteStyle map'
});

var AtlasStyle = L.tileLayer('mapStyles/styleAtlas/{z}/{x}/{y}.jpg', {
    minZoom: 0,
    maxZoom: 5,
    noWrap: true,
    continuousWorld: false,
    attribution: 'www.gtamap.xyz',
    id: 'styleAtlas map'
});

var GridStyle = L.tileLayer('mapStyles/styleGrid/{z}/{x}/{y}.png', {
    minZoom: 0,
    maxZoom: 5,
    noWrap: true,
    continuousWorld: false,
    attribution: 'www.gtamap.xyz',
    id: 'styleGrid map'
});

// Grupo de marcadores
var ExampleGroup = L.layerGroup();
var Icons = {
    'Example': ExampleGroup
};

// Mapa principal
var mymap = L.map('map', {
    crs: CUSTOM_CRS,
    minZoom: 1,
    maxZoom: 5,
    Zoom: 5,
    maxNativeZoom: 5,
    preferCanvas: true,
    layers: [SateliteStyle, Icons['Example']],
    center: [0, 0],
    zoom: 3
});

// Controle de camadas
var layersControl = L.control.layers({
    'Satelite': SateliteStyle,
    'Atlas': AtlasStyle,
    'Grid': GridStyle
}).addTo(mymap);

// Ícone customizado para blips
function customIcon(name) {
    return L.icon({
        iconUrl: 'blips/' + name + '.png',
        iconSize: [30, 30],
        iconAnchor: [20, 20],
        popupAnchor: [-10, -27]
    });
}

// Click no mapa → marker com coordenadas
var marker;
mymap.on('click', function(e) {
    if (marker) mymap.removeLayer(marker);
    var latlng = e.latlng;
    var lat = latlng.lat;
    var lng = latlng.lng;
    var zoom = 16;
    marker = new L.marker([lat, lng])
        .addTo(Icons['Example'])
        .bindPopup('<b>X: ' + lng.toFixed(3) + ' | Y: ' + lat.toFixed(3) + '</b>');
    mymap.setView([lat, lng], zoom);
    mymap.removeLayer(azurirajmarker);
});

// Form de busca por coordenadas X/Y
var azurirajmarker;
$('#formular').submit(function(e) {
    e.preventDefault();
    if ($.trim($('#xinput').val()) === '' || $.trim($('#yinput').val()) === '') {
        return alert('Please fill X and Y coords'), false;
    }
    mymap.eachLayer(function(layer) {
        if (layer._latlng != undefined) {
            layer.remove();
        }
    });
    var zoom = 16;
    var xval = $('#xinput').val();
    var yval = $('#yinput').val();
    azurirajmarker = new L.marker([yval, xval])
        .addTo(Icons['Example'])
        .bindPopup('<b>X: ' + xval + ' | Y: ' + yval + '</b>');
    mymap.setView([yval, xval], zoom);
    $('#markerSkripta').empty().append('<script>' + azurirajmarker + '<\/script>');
});
