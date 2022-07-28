function pageRedirect () {
    var selectField = document.getElementById("visualization_controller");
    var selectField_value = selectField.value;

    if (selectField_value == 'surface-map') {
        window.location.replace("visualizations/surface_map.html");
    } else if (selectField_value == "bivariate-choropleth") {
        window.location.replace("visualizations/bivariate_choropleth.html");
    } else if (selectField_value == "bubble-map") {
        window.location.replace("visualizations/bubble_map.html");
    }

}
