require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/smartMapping/renderers/relationship",

], function(esriConfig, Map, MapView, FeatureLayer, relationshipRendererCreator) {

    esriConfig.apiKey = "AAPKdfcc4a7dcc7e4176a137c38b87516e64P2haNjbiyKdPRWUk4feYG-Es6ebTY3T8bYJRXrSN-2gUKssSU5kF4T6brCoTDrEq";

    var map = new Map({
        basemap: "topo-vector"
    });

    const view = new MapView({
        map: map,  // References a Map instance
        container: "viewDiv",  // References the ID of a DOM element
        center: [-71.50543,42.52700],
        zoom: 9
    });

    var customLayer = new FeatureLayer({
        url: "https://services1.arcgis.com/qN3V93cYGMKQCOxL/arcgis/rest/services/MA_13/FeatureServer"
    });

    map.add(customLayer);

});