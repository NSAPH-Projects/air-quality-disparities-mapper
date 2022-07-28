console.log("loaded successfully");

require([
    "esri/config",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/ScaleBar",
    "esri/widgets/Expand",
    "esri/widgets/Search",
    "esri/widgets/Legend"
], function(esriConfig, WebMap, MapView, Expand, ScaleBar, Search, Legend) {
    esriConfig.apiKey = "AAPKdfcc4a7dcc7e4176a137c38b87516e64P2haNjbiyKdPRWUk4feYG-Es6ebTY3T8bYJRXrSN-2gUKssSU5kF4T6brCoTDrEq";
    const webmap = new WebMap({
        portalItem: {
            id: "1a65f87408994046a27bd5a6b8bd3003"
        }
    });

    const view = new MapView({
        container: "viewDiv",
        map: webmap
    });
    const scalebar = new ScaleBar({
        view: view
    });
    view.ui.add(scalebar, "bottom-left");
    const legend = new Legend ({
        view: view
    });
    view.ui.add(legend, "top-right");
    const searchWidget = new Search({
        view: view
    });
    view.ui.add(searchWidget, {
        position: "bottom-right",
        index: 2
    });

});