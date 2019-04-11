function graphs(data,label,extraInfo) {
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 500 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var text = d3.select("#my_dataviz").append('h3').html(label);
var text = d3.select("#my_dataviz").append('h6').html(extraInfo);

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// create dummy data
//var data = [12,19,11,13,12,22,13,4,15,16,18,19,20,12,11,9]

// Compute summary statistics used for the box:
var data_sorted = data.sort(d3.ascending)
var q1 = d3.quantile(data_sorted, .25)
var median = d3.quantile(data_sorted, .5)
var q3 = d3.quantile(data_sorted, .75)
var interQuantileRange = q3 - q1
var min = q1 - 1.5 * interQuantileRange
var max = q1 + 1.5 * interQuantileRange

// Show the Y scale
var y = d3.scaleLinear()
  .domain([0,max])
  .range([height, 0]);
svg.call(d3.axisLeft(y))

// a few features for the box
var center = 200
var width = 100

// Show the main vertical line
svg
.append("line")
  .attr("x1", center)
  .attr("x2", center)
  .attr("y1", y(min) )
  .attr("y2", y(max) )
  .attr("stroke", "black")

// Show the box
svg
.append("rect")
  .attr("x", center - width/2)
  .attr("y", y(q3) )
  .attr("height", (y(q1)-y(q3)) )
  .attr("width", width )
  .attr("stroke", "black")
  .style("fill", "#69b3a2")

// show median, min and max horizontal lines
svg
.selectAll("toto")
.data([min, median, max])
.enter()
.append("line")
  .attr("x1", center-width/2)
  .attr("x2", center+width/2)
  .attr("y1", function(d){ return(y(d))} )
  .attr("y2", function(d){ return(y(d))} )
  .attr("stroke", "black")
  
  // ===== ====== Histogram ===== ======

    // set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  // X axis: scale and draw:
  var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d })])
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3.histogram()
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")


}

function Matrix(options) {
  var margin = {top: 50, right: 50, bottom: 100, left: 100},
      width = 500,
      height = 500,
      data = options.data,
      container = options.container,
      labelsData = options.labels,
      startColor = options.start_color,
      endColor = options.end_color;

  var widthLegend = 100;

  if(!data){
    throw new Error('Please pass data');
  }

  if(!Array.isArray(data) || !data.length || !Array.isArray(data[0])){
    throw new Error('It should be a 2-D array');
  }

    var maxValue = d3.max(data, function(layer) { return d3.max(layer, function(d) { return d; }); });
    var minValue = d3.min(data, function(layer) { return d3.min(layer, function(d) { return d; }); });

  var numrows = data.length;
  var numcols = data[0].length;

  var svg = d3.select(container).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var background = svg.append("rect")
      .style("stroke", "black")
      .style("stroke-width", "2px")
      .attr("width", width)
      .attr("height", height);

  var x = d3.scaleBand()
      .domain(d3.range(numcols))
      .range([0, width]);

  var y = d3.scaleBand()
      .domain(d3.range(numrows))
      .range([0, height]);

  var colorMap = d3.scaleLinear()
      .domain([minValue,maxValue])
      .range([startColor, endColor]);

  var row = svg.selectAll(".row")
      .data(data)
      .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

  var cell = row.selectAll(".cell")
      .data(function(d) { return d; })
      .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });

  cell.append('rect')
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("stroke-width", 0);

    cell.append("text")
      .attr("dy", ".32em")
      .attr("x", x.bandwidth() / 2)
      .attr("y", y.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .style("fill", function(d, i) { return d >= maxValue/2 ? 'white' : 'black'; })
      .text(function(d, i) { return d; });

  row.selectAll(".cell")
      .data(function(d, i) { return data[i]; })
      .style("fill", colorMap);

  var labels = svg.append('g')
    .attr('class', "labels");

  var columnLabels = labels.selectAll(".column-label")
      .data(labelsData)
      .enter().append("g")
      .attr("class", "column-label")
      .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; });

  columnLabels.append("line")
    .style("stroke", "black")
      .style("stroke-width", "1px")
      .attr("x1", x.bandwidth() / 2)
      .attr("x2", x.bandwidth() / 2)
      .attr("y1", 0)
      .attr("y2", 5);

  columnLabels.append("text")
      .attr("x", 0)
      .attr("y", y.bandwidth() / 2)
      .attr("dy", ".82em")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-60)")
      .text(function(d, i) { return d; });

  var rowLabels = labels.selectAll(".row-label")
      .data(labelsData)
    .enter().append("g")
      .attr("class", "row-label")
      .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

  rowLabels.append("line")
    .style("stroke", "black")
      .style("stroke-width", "1px")
      .attr("x1", 0)
      .attr("x2", -5)
      .attr("y1", y.bandwidth() / 2)
      .attr("y2", y.bandwidth() / 2);

  rowLabels.append("text")
      .attr("x", -8)
      .attr("y", y.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d, i) { return d; });

    var key = d3.select("#legend")
    .append("svg")
    .attr("width", widthLegend)
    .attr("height", height + margin.top + margin.bottom);

    var legend = key
    .append("defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "100%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

    legend
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", endColor)
    .attr("stop-opacity", 1);

    legend
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", startColor)
    .attr("stop-opacity", 1);

    key.append("rect")
    .attr("width", widthLegend/2-10)
    .attr("height", height)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(0," + margin.top + ")");

    var y = d3.scaleLinear()
    .range([height, 0])
    .domain([minValue, maxValue]);

    var yAxis = d3.axisRight(y);

    key.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(41," + margin.top + ")")
    .call(yAxis)
}