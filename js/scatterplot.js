let colorVariable = defaultColorField;

let sizeVariable = defaultSizeField;

let GEOID = current_GEOID;

let previous_selection;

let previous_selection_element;

let margin = {container_width: 410, container_height: 320, top: 10, right: 30, bottom: 60, left: 60},
    width = margin.container_width - margin.left - margin.right,
    height = margin.container_height - margin.top - margin.bottom;

let svg = d3.select("#scatterPlot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

function drawGraph() {

    d3.csv("https://raw.githubusercontent.com/EthanMcFarlin/air-quality-disparities-mapper/main/data/2010_us_counties_pm25.csv", function(data) {

        let xMin = d3.min(data, function(d){
            return d[sizeVariable];
        });

        let xMax = d3.max(data, function(d){
            if (sizeVariable == "pm25") {
                return d[sizeVariable] * 1.05;
            } else {
                return d[sizeVariable];
            }

        });

        let yMin = d3.min(data, function(d){
            return d[colorVariable];
        });

        let yMax = d3.max(data, function(d){
            if ( (defaultColorField == ("population") ) || ((defaultColorField == "n_housing_")) || ((defaultColorField == "n_occupied")) || (defaultColorField == ("n_househol") )  ) {
                return d[colorVariable] * 0.6;
            }
            return d[colorVariable];
        });

        let x = d3.scaleLinear()
            .domain([xMin, xMax*1.05])
            .range([ 0, width ]);

        let xAxis = svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        let y = d3.scaleLinear()
            .domain([yMin, yMax*1.05])
            .range([ height, 0]);

        let yAxis = svg.append("g")
            .attr("class", "axis y-axis")
            .call(d3.axisLeft(y));

        let xLabel = svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("y", function() {
                return (margin.container_height - 35);
            })
            .attr("x", function() {
                return (margin.container_width - 100);
            })
            .attr("dy", "0.52em")
            .text(function(d) {
                return defaultSizeField;
            });

        let yLabel = svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", function() {
                if ( (defaultColorField == ("population") ) || ((defaultColorField == "n_housing_")) || ((defaultColorField == "n_occupied")) || (defaultColorField == ("n_househol") )  ) {
                    return (margin.left - 48);
                }

                return (margin.bottom - 110);
            })
            .attr("x", function() {
                return (margin.left - 70);
            })
            .attr("dy", "0.52em")
            .attr("transform", "rotate(-90)")
            .text(function(d) {
                return defaultColorField;
            });

        let surface = svg.append("defs").append("svg:clipPath")
            .attr("id", "surface")
            .append("svg:rect")
            .attr("y", 0)
            .attr("x", 0)
            .attr("height", height )
            .attr("width", width );

        let changeScales = d3.zoom()
            // .scaleExtent([.48, 18])
            .scaleExtent([1, 18])
            .translateExtent( [[0.1,0], [width, height]] )
            .extent([[0, 0], [width, height]])
            .on("zoom", refreshData);

        let overlayed_canvas = svg.append("rect")
            .attr("height", height)
            .attr("width", width)
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(changeScales);

        function colors (input) {
            if (input.GEOID10 == GEOID) {
                return "rgba(170, 170, 251, 0.8)";
            } else {
                return "rgba(208, 208, 208, 0.5)";
            }
        }

        function radius (input) {
            if (input.GEOID10 == GEOID) {
                return 20;
            } else {
                return 3;
            }
        }

        let bubbles = svg.append('g')
            .attr("clip-path", "url(#surface)")

        bubbles
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d[sizeVariable]); } )
            .attr("cy", function (d) { return y(d[colorVariable]); } )
            .attr("r", function(d) { return radius(d)})
            .attr("class", function(d) {
                if (d.GEOID10 == GEOID) {
                    return "chosenGEOID"
                    // previous_selection_element = d;
                }
            })
            .attr("fill", function(d){

                return colors(d)
            })

        function refreshData() {

            let refactoredX = d3.event.transform.rescaleX(x);
            let refactoredY = d3.event.transform.rescaleY(y);

            yAxis.call(d3.axisLeft(refactoredY))
            xAxis.call(d3.axisBottom(refactoredX))

            bubbles
                .selectAll("circle")
                .attr('cy', function(d) {return refactoredY(d[colorVariable])})
                .attr('cx', function(d) {return refactoredX(d[sizeVariable])});

        }

        let tooltip = d3.select("body").append('div')
            .attr('class', "tooltip");

        svg.selectAll("circle").on('click', function(d, event) {

            d3.select(".chosenGEOID").attr("fill", function() {
                return "rgba(208, 208, 208, 0.5)";
            })

            d3.select(".chosenGEOID").attr("r", function() {
                return 3;
            })

            if (previous_selection != null) {
                d3.select(previous_selection).attr("fill", function(d) {
                    return "rgba(208, 208, 208, 0.5)";
                })
                d3.select(previous_selection).attr("r", function(d) {
                    return 3;
                })
            }

            previous_selection = this;

            d3.select(this).attr("fill", function(d) {
                return "rgba(170, 170, 251, 0.8)";
            });
            d3.select(this).attr("r", function(d) {
                return 20;
            })

            teleportToFeature(d.GEOID10);
        })

        svg.selectAll("circle").on('mouseover', function(d, event) {

            e = window.event;

            d3.select(this)
                .attr('stroke-width', '2.5px')
                .attr('stroke', '#BBBBFC')
                .attr('opacity', 0.7)

            tooltip
                .style("opacity", function() {
                    return 1;
                })
                .style("left", e.pageX + 20 + "px")
                .style("top", e.pageY + "px")
                .html(`
       <div>
         <p><span><b>Name</b>: ${d.NAMELSAD10}</span></p>                                           
       </div>`);
        })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("opacity", 1)
                tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);

            })

    })


}

function refreshGraph() {
    // console.log("refreshing");
    svg.selectAll("*").remove();
    colorVariable = defaultColorField;
    sizeVariable = defaultSizeField;
    GEOID = current_GEOID;

    drawGraph();
}


drawGraph();