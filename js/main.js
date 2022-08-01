let defaultSizeField = "ec_pred"
let defaultSizeLegend = "predicted elemental carbon (height)";
let defaultSizeLowerStop = 0.17;
let defaultSizeUpperStop = 0.51;
let defaultSizeLowerLabel = "<0.17 (10th percentile)";
let defaultSizeUpperLabel = ">0.51 (95th percentile)";
let defaultSizePopupText = "is the predicted measure of elemental carbon, also in 2010.";

let defaultColorField = "pct_black";
let defaultColorLegend = "% population identifying as black (color) ";
let defaultColorLowerStop = 0.0;
let defaultColorUpperStop = 1.0;
let defaultColorLowerLabel = "0%";
let defaultColorUpperLabel = "100%";
let defaultColorPopupText = "represents the percentage (as a decimal) of the population in this county identifying as African American in 2010.";

let currentColorValueStore;
let currentSizeValueStore;

require([
    "esri/config",
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/smartMapping/statistics/summaryStatistics",
    "esri/widgets/Search",
], function(esriConfig, Map, SceneView, FeatureLayer, Legend, Expand, summaryStatistics, Search) {

    esriConfig.apiKey = "AAPKdfcc4a7dcc7e4176a137c38b87516e64P2haNjbiyKdPRWUk4feYG-Es6ebTY3T8bYJRXrSN-2gUKssSU5kF4T6brCoTDrEq";

    const renderer = {
        type: "simple",
        symbol: {
            type: "polygon-3d",
            symbolLayers: [
                {
                    type: "extrude"
                }
            ]
        },
        visualVariables: [
            {
                type: "size",
                field: defaultSizeField,
                legendOptions: {
                    title: defaultSizeLegend
                },
                stops: [
                    {
                        value: defaultSizeLowerStop,
                        size: 4000,
                        label: defaultSizeLowerLabel
                    },
                    {
                        value: defaultSizeUpperStop,
                        size: 200000,
                        label: defaultSizeUpperLabel
                    }
                ]
            },
            {
                type: "color",
                field: defaultColorField,
                legendOptions: {
                    title: defaultColorLegend
                },
                stops: [
                    {
                        value: defaultColorLowerStop,
                        color: "#d1e1ff",
                        label: defaultColorLowerLabel
                    },
                    {
                        value: defaultColorUpperStop,
                        color: "#144db8",
                        label: defaultColorUpperLabel
                    }
                ]
            }
        ]
    };

    const customLayer = new FeatureLayer({
        url:
            // "https://services1.arcgis.com/qN3V93cYGMKQCOxL/arcgis/rest/services/MA_16/FeatureServer",
            // "https://services1.arcgis.com/qN3V93cYGMKQCOxL/arcgis/rest/services/us_counties_4/FeatureServer",
            // "https://services1.arcgis.com/qN3V93cYGMKQCOxL/arcgis/rest/services/test33/FeatureServer",
            // "https://services1.arcgis.com/qN3V93cYGMKQCOxL/arcgis/rest/services/test38/FeatureServer",
            // "https://services1.arcgis.com/qN3V93cYGMKQCOxL/arcgis/rest/services/us_counties_19/FeatureServer",
            "https://services1.arcgis.com/qN3V93cYGMKQCOxL/arcgis/rest/services/us_counties_22/FeatureServer",
        renderer: renderer,
        title: "Air pollution exposure by demographics (2010)",
        outFields: ["*"],
        popupTemplate: {
            title: "{NAMELSAD10}",
            fieldInfos: [
                {
                    fieldName: "ec_pred",
                    format: {
                        digitSeparator: false,
                        places: 3
                    }
                },
                {
                    fieldName: "pct_black",
                    format: {
                        digitSeparator: false,
                        places: 3
                    }
                }
            ],
            content: [
                {
                    type: "text",
                    text: "{pct_black} represents the percentage (as a decimal) of the " +
                        "population in this county identifying as African American in 2010.",
                },
                {
                    type: "custom",
                    creator: () => {

                        if (currentColorValueStore == null || currentSizeValueStore == null) {
                            const error = document.createElement("div");
                            error.innerHTML = "Error grabbing attributes from feature. Try zooming in closer to the county and clicking again."
                            return error;
                        }

                        const p = document.createElement("ul");
                        const child = document.createElement("li");

                        p.style.paddingLeft = "20px";

                        p.appendChild(child);

                        let bigger_value;
                        let smaller_value;

                        let surrounding_text;

                        let field = defaultColorField;

                        let value_1 = currentColorValueStore.toFixed(3);

                        let value_2 = retrieveAverage(field);

                        value_2.then(value2 => {

                            let new_value_2 = value2.toFixed(3);

                            if (value_1 > new_value_2) {
                                bigger_value = value_1;
                                smaller_value = new_value_2;
                                surrounding_text = " greater than the national average of ";
                            } else {
                                bigger_value = new_value_2;
                                smaller_value = value_1;
                                surrounding_text = " less than the national average of ";
                            }

                            let percent_difference = ( ( Math.abs(new_value_2 - value_1) / new_value_2 ) * 100) ;

                            child.innerHTML = "This is " + "<b>" + percent_difference.toFixed(1) + "%" + "</b>" + surrounding_text + new_value_2 + ".";

                        })

                        return p;

                    },
                },
                {
                    type: "text",
                    text: "{ec_pred} is the predicted measure of elemental carbon, also in 2010.",

                },
                {
                    type: "custom",
                    creator: () => {

                        if (currentColorValueStore == null || currentSizeValueStore == null) {
                            const error = document.createElement("div");
                            error.innerHTML = "Error grabbing attributes from feature. Try zooming in closer to the county and clicking again."
                            return error;
                        }

                        const p = document.createElement("ul");
                        const child = document.createElement("li");

                        p.style.paddingLeft = "20px";

                        p.appendChild(child);

                        let bigger_value;
                        let smaller_value;

                        let surrounding_text;

                        let field = defaultSizeField;

                        let value_1 = currentSizeValueStore;

                        let value_2 = retrieveAverage(field);

                        value_2.then(value2 => {

                            let new_value_2 = value2.toFixed(3);

                            if (value_1 > value2) {
                                bigger_value = value_1;
                                smaller_value = new_value_2;
                                surrounding_text = " greater than the national average of ";
                            } else {
                                bigger_value = new_value_2;
                                smaller_value = value_1;
                                surrounding_text = " less than the national average of ";
                            }

                            let percent_difference = ( ( Math.abs(new_value_2 - value_1) / new_value_2 ) * 100) ;

                            child.innerHTML = "This is " + "<b>" + percent_difference.toFixed(1) + "%" + "</b>" + surrounding_text + new_value_2 + ".";

                        })

                        return p;

                    },
                }
            ],



        },
    });

    const map = new Map({
        basemap: "gray-vector",
        layers: [customLayer]
    });

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: {
                latitude: 20.8282,
                longitude: -98.5795,
                z: 5000101
            },
            tilt: 20,
            heading: 10
        }
    });

    const legend = new Legend({
        view: view
    });

    function retrieveAverage(variableName) {
        return summaryStatistics({
            layer: customLayer,
            field: variableName
        }).then(function(statistics) {
            return statistics.avg;
        });
    }

    view.ui.add(legend, "bottom-right");

    const selectionMenu = document.getElementById("variable-selector");
    contentInsidePopup = new Expand({
        expandIconClass: "esri-icon-sliders-horizontal",
        expanded: true,
        view: view,
        content: selectionMenu
    });
    view.ui.add(contentInsidePopup, {
        position: "top-left",
        index: 1
    });

    const demographicHolder = document.getElementById("demographic-holder");
    demographicHolder.addEventListener('change', function (e) {
        let changedField = e.target;

        view.popup.close();

        switch (changedField.id) {
            case 'population':
                setDemographicVariable("population", "population (color)", 0.0, 500000, "0 people", "500,000 people", "represents the population in 2010.")
                break;
            case 'pct_female':
                console.log('pct_female 2');
                setDemographicVariable("pct_female", "% population identifying as female (color)", 0.4, 0.7, "40%", "70%", "represents the percentage (as a decimal) of the population in this county identifying as female in 2010.")
                break;
            case 'pct_age_under_5':
                setDemographicVariable("pct_age_un", "% population under the age of 5 (color)", 0.00, 0.2, "0%", "20%", "represents the percentage (as a decimal) of the population in this county under the age of 5 in 2010.")
                break;
            case 'pct_age_over_85':
                setDemographicVariable("pct_age_ov", "% population over the age of 85 (color)", 0.0, 0.1, "0%", "10%", "represents the percentage (as a decimal) of the population in this county over the age of 85 in 2010.")
                break;
            case 'pct_white':
                setDemographicVariable("pct_white", "% population identifying as white (color)", 0.0, 1.0, "0%", "100%", "represents the percentage (as a decimal) of the population in this county identifying as white in 2010.")
                break;
            case 'pct_black':
                setDemographicVariable("pct_black", "% population identifying as black (color)", 0.0, 1.0, "0%", "100%", "represents the percentage (as a decimal) of the population in this county identifying as black in 2010.")
                break;
            case 'pct_native':
                setDemographicVariable("pct_native", "% population identifying as native (color)", 0.0, 1.0, "0%", "100%", "represents the percentage (as a decimal) of the population in this county identifying as native in 2010.")
                break;
            case 'pct_asian':
                setDemographicVariable("pct_asian", "% population identifying as asian (color)", 0.0, 0.4, "0%", "40%", "represents the percentage (as a decimal) of the population in this county identifying as asian in 2010.")
                break;
            case 'pct_two_or_more_races':
                setDemographicVariable("pct_two_or", "% population identifying as two or more races (color)", 0.0, 0.1, "0%", "10%", "represents the percentage (as a decimal) of the population in this county identifying as two or more races in 2010.")
                break;
            case 'pct_hispanic':
                setDemographicVariable("pct_hispan", "% population identifying as hispanic (color)", 0.0, 1.0, "0%", "100%", "represents the percentage (as a decimal) of the population in this county identifying as hispanic in 2010.")
                break;
            case 'n_households':
                setDemographicVariable("n_househol", "number of households (color)", 0.0, 100000.0, "0 households", "100,000 households", "represents the number of households in this county in 2010.")
                break;
            case 'pct_households_single_father':
                setDemographicVariable("pct_househ", "% households with a single father (color)", 0.01, 0.15, "5%", "15%", "represents the percentage (as a decimal) of households in this county with a single father in 2010.")
                break;
            case 'pct_households_single_mother':
                setDemographicVariable("pct_hous_1", "% households with a single mother (color)", 0.1, 0.5, "10%", "50%", "represents the percentage (as a decimal) of households in this county with a single mother in 2010.")
                break;
            case 'n_housing_units':
                setDemographicVariable("n_housing_", "number of housing units (color)", 0.0, 100000.0, "0 housing units", "100,000 housing unnits", "represents the number of housing units in this county in 2010.")
                break;
            case 'n_occupied_housing_units':
                setDemographicVariable("n_occupied", "number of occupied housing units (color)", 0.0, 100000.0, "0 housing units", "100,000 housing units", "represents the number of occupied housing units in this county in 2010.")
                break;
            case 'pct_renting':
                setDemographicVariable("pct_rentin", "% renting (color)", 0.0, 1.0, "0%", "100%", "represents the percentage (as a decimal) renting in this county in 2010.")
                break;
        }

    });

    function setDemographicVariable
    (field, legend, lower_stop, upper_stop, lower_label, upper_label, popup_text) {
        console.log("check: setDemographicVariable");
        defaultColorField = field;
        defaultColorLegend = legend;
        defaultColorLowerStop = lower_stop;
        defaultColorUpperStop = upper_stop;
        defaultColorLowerLabel = lower_label;
        defaultColorUpperLabel = upper_label;
        defaultColorPopupText = popup_text;

        refreshDemographicRenderer(field, legend, lower_stop, upper_stop, lower_label, upper_label, popup_text);
    }

    function refreshDemographicRenderer(field, legend, lower_stop, upper_stop, lower_label, upper_label, popup_text) {
        console.log("check: refresh rendererer");

        customLayer.popupTemplate = {
            title: "{NAMELSAD10}",
            content: [
                {
                    type: "text",
                    text: "{" + field + "}" + " " + popup_text,
                },
                {
                    type: "custom",
                    creator: () => {

                        if (currentColorValueStore == null || currentSizeValueStore == null) {
                            const error = document.createElement("div");
                            error.innerHTML = "Error grabbing attributes from feature. Try zooming in closer to the county and clicking again."
                            return error;
                        }

                        const p2 = document.createElement("ul");
                        const child2 = document.createElement("li");

                        p2.style.paddingLeft = "20px";

                        p2.appendChild(child2);

                        let bigger_value;
                        let smaller_value;

                        let surrounding_text;

                        let field2 = field;

                        let value_1 = currentColorValueStore.toFixed(3);

                        let value_2 = retrieveAverage(field2);

                        value_2.then(value2 => {

                            let new_value_2 = value2.toFixed(3);

                            if (value_1 > value2) {
                                bigger_value = value_1;
                                smaller_value = new_value_2;
                                surrounding_text = " greater than the national average of ";
                            } else {
                                bigger_value = new_value_2;
                                smaller_value = value_1;
                                surrounding_text = " less than the national average of ";
                            }

                            let percent_difference = ( ( Math.abs(new_value_2 - value_1) / new_value_2 ) * 100) ;

                            child2.innerHTML = "This is " + "<b>" + percent_difference.toFixed(1) + "%" + "</b>" + surrounding_text + new_value_2 + ".";

                        })

                        return p2;

                    },
                },
                {
                    type: "text",
                    text: "{" + defaultSizeField + "}" + " " + defaultSizePopupText,

                },
                {
                    type: "custom",
                    creator: () => {

                        if (currentColorValueStore == null || currentSizeValueStore == null) {
                            const error = document.createElement("div");
                            error.innerHTML = "Error grabbing attributes from feature. Try zooming in closer to the county and clicking again."
                            return error;
                        }

                        const p = document.createElement("ul");
                        const child = document.createElement("li");

                        p.style.paddingLeft = "20px";

                        p.appendChild(child);

                        let bigger_value;
                        let smaller_value;

                        let surrounding_text;

                        let field = defaultSizeField;

                        let value_1 = currentSizeValueStore;

                        let value_2 = retrieveAverage(field);

                        value_2.then(value2 => {

                            let new_value_2 = value2.toFixed(3);

                            if (value_1 > new_value_2) {
                                bigger_value = value_1;
                                smaller_value = new_value_2;
                                surrounding_text = " greater than the national average of ";
                            } else {
                                bigger_value = new_value_2;
                                smaller_value = value_1;
                                surrounding_text = " less than the national average of ";
                            }

                            let percent_difference = ( ( Math.abs(new_value_2 - value_1) / new_value_2 ) * 100) ;

                            child.innerHTML = "This is " + "<b>" + percent_difference.toFixed(1) + "%" + "</b>" + surrounding_text + new_value_2 + ".";

                        })

                        return p;

                    },
                }
            ],
            fieldInfos: [
                {
                    fieldName: defaultSizeField,
                    format: {
                        digitSeparator: false,
                        places: 3
                    }
                },
                {
                    fieldName: field,
                    format: {
                        digitSeparator: false,
                        places: 3
                    }
                }
            ]


        };

        let new_renderer = customLayer.renderer.clone();
        const colorVariable = new_renderer.visualVariables[1];
        colorVariable.field = field;
        colorVariable. legendOptions =
            {
                title: legend
            }
        colorVariable.stops =
         [
            {
                value: lower_stop,
                color: "#d1e1ff",
                label: lower_label
            },
            {
                value: upper_stop,
                color: "#144db8",
                label: upper_label
            }
        ]
        customLayer.renderer = new_renderer;
    }

    const pollutionHolder = document.getElementById("pollution-holder");
    pollutionHolder.addEventListener('change', function (e) {
        let changedField = e.target;

        view.popup.close();

        switch (changedField.id) {
            case 'ec':
                setPollutionVariable("ec_pred", "EC prediction (height)", 0.22, 0.66, "<0.17 (10th percentile)", ">0.51 (95th percentile)", "is the predicted measure of ammonium, also in 2010.")
                break;
            case 'ammonium':
                setPollutionVariable("nh4_predic", "NH4+ prediction (height)", 0.31, 1.34, "<0.31 (10th percentile)", ">1.34 (95th percentile)", "is the predicted measure of ammonium, also in 2010.")
                break;
            case 'nitrate':
                setPollutionVariable("no3_predic", "NO3- prediction (height)", 0.40, 2.08, "<0.40 (10th percentile)", ">2.08 (95th percentile)", "is the predicted measure of nitrate, also in 2010.")
                break;
            case 'oc':
                setPollutionVariable("oc_predict", "OC prediction (height)", 0.98, 2.28, "<0.98 (10th percentile)", ">2.28 (95th percentile)", "is the predicted measure of organic carbon, also in 2010.")
                break;
            case 'sulfate':
                setPollutionVariable("so42_predi", "SO42- prediction (height)", 0.68, 3.01, "<0.68 (10th percentile)", ">3.01 (95th percentile)", "is the predicted measure of sulfate, also in 2010.")
                break;
        }

    });

    function setPollutionVariable
    (field, legend, lower_stop, upper_stop, lower_label, upper_label, popup_text) {
        console.log("check: setPollutionVariable");
        defaultSizeField = field;
        defaultSizeLegend = legend;
        defaultSizeLowerStop = lower_stop;
        defaultSizeUpperStop = upper_stop;
        defaultSizeLowerLabel = lower_label;
        defaultSizeUpperLabel = upper_label;
        defaultSizePopupText = popup_text;

        refreshPollutionRenderer(field, legend, lower_stop, upper_stop, lower_label, upper_label, popup_text);
    }

    function refreshPollutionRenderer(field, legend, lower_stop, upper_stop, lower_label, upper_label, popup_text) {
        console.log("check: refresh pollution rendererer");

        customLayer.popupTemplate = {
            title: "{NAMELSAD10}",
            content: [
                {
                    type: "text",
                    text: "{" + defaultColorField + "}" + " " + defaultColorPopupText,
                },
                {
                    type: "custom",
                    creator: () => {

                        if (currentColorValueStore == null || currentSizeValueStore == null) {
                            const error = document.createElement("div");
                            error.innerHTML = "Error grabbing attributes from feature. Try zooming in closer to the county and clicking again."
                            return error;
                        }

                        const p = document.createElement("ul");
                        const child = document.createElement("li");

                        p.style.paddingLeft = "20px";

                        p.appendChild(child);

                        let bigger_value;
                        let smaller_value;

                        let surrounding_text;

                        let field = defaultColorField;

                        let value_1 = currentColorValueStore.toFixed(3);

                        let value_2 = retrieveAverage(field);

                        value_2.then(value2 => {

                            let new_value_2 = value2.toFixed(3);

                            if (value_1 > value2) {
                                bigger_value = value_1;
                                smaller_value = new_value_2;
                                surrounding_text = " greater than the national average of ";
                            } else {
                                bigger_value = new_value_2;
                                smaller_value = value_1;
                                surrounding_text = " less than the national average of ";
                            }

                            let percent_difference = ( ( Math.abs(new_value_2 - value_1) / new_value_2 ) * 100) ;

                            child.innerHTML = "This is " + "<b>" + percent_difference.toFixed(1) + "%" + "</b>" + surrounding_text + new_value_2 + ".";

                        })

                        return p;

                    },
                },
                {
                    type: "text",
                    text: "{" + field + "}" + " " + popup_text,

                },
                {
                    type: "custom",
                    creator: () => {

                        if (currentColorValueStore == null || currentSizeValueStore == null) {
                            const error = document.createElement("div");
                            error.innerHTML = "Error grabbing attributes from feature. Try zooming in closer to the county and clicking again."
                            return error;
                        }

                        const p2 = document.createElement("ul");
                        const child2 = document.createElement("li");

                        p2.style.paddingLeft = "20px";

                        p2.appendChild(child2);

                        let bigger_value;
                        let smaller_value;

                        let surrounding_text;

                        let field2 = field;

                        let value_1 = currentSizeValueStore.toFixed(3);

                        let value_2 = retrieveAverage(field2);

                        value_2.then(value2 => {

                            let new_value_2 = value2.toFixed(3);

                            if (value_1 > new_value_2) {
                                bigger_value = value_1;
                                smaller_value = new_value_2;
                                surrounding_text = " greater than the national average of ";
                            } else {
                                bigger_value = new_value_2;
                                smaller_value = value_1;
                                surrounding_text = " less than the national average of ";
                            }

                            let percent_difference = ( ( Math.abs(new_value_2 - value_1) / new_value_2 ) * 100) ;

                            child2.innerHTML = "This is " + "<b>" + percent_difference.toFixed(1) + "%" + "</b>" + surrounding_text + new_value_2 + ".";

                        })

                        return p2;

                    },
                }
            ],
            fieldInfos: [
                {
                    fieldName: field,
                    format: {
                        digitSeparator: false,
                        places: 3
                    }
                },
                {
                    fieldName: defaultColorField,
                    format: {
                        digitSeparator: false,
                        places: 3
                    }
                }
            ]


        };

        let new_renderer = customLayer.renderer.clone();
        const sizeVariable = new_renderer.visualVariables[0];
        sizeVariable.field = field;
        sizeVariable. legendOptions =
            {
                title: legend
            }
        sizeVariable.stops =
            [
                {
                    value: lower_stop,
                    size: 4000,
                    label: lower_label
                },
                {
                    value: upper_stop,
                    size: 200000,
                    label: upper_label
                }
            ]
        customLayer.renderer = new_renderer;
    }

    view.on('click',(event) =>{
        view.hitTest(event)
            .then((response) =>{

                // console.log("log this response (size): " + currentSizeValueStore);
                // console.log("log this response (color): " + currentColorValueStore);

                currentSizeValueStore = response.results[0].graphic.attributes[defaultSizeField];
                currentColorValueStore = response.results[0].graphic.attributes[defaultColorField];
            });
    });

});


