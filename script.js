document.addEventListener("DOMContentLoaded", function () {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const dataset = data.data;
      //console.log(dataset);
      const w = 900;
      const h = 500;
      const padding = 60;

      const svg = d3.select("#chart").attr("width", w).attr("height", h);

      const tooltip = d3.select("#tooltip");

      const years = dataset.map((item) => new Date(item[0]));
      const gdpValues = dataset.map((item) => item[1]);

      const xScale = d3
        .scaleTime()
        .domain([d3.min(years), d3.max(years)])
        .range([padding, w - padding]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(gdpValues)])
        .range([h - padding, padding]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg
        .append("g")
        .attr("transform", `translate(0, ${h - padding})`)
        .attr("id", "x-axis")
        .call(xAxis);

      svg.append("g").attr("transform", `translate(${padding}, 0)`).attr("id", "y-axis").call(yAxis);

      svg
        .selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d, i) => xScale(years[i]))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", (w - 2 * padding) / dataset.length)
        .attr("height", (d) => h - padding - yScale(d[1]))
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(`Data: ${d[0]}<br>GDP: $${d[1]} Billions`)
            .attr("data-date", d[0])
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 30 + "px");
        })
        .on("mouseout", function (d) {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    })
    .catch((error) => console.error("Error loading data:", error));
});
