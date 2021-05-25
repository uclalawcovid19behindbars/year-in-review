class Linechart {

    constructor(state, setGlobalState) {
      // initialize properties 
      this.width = window.innerWidth * 0.8;
      this.height = window.innerHeight * 0.6;
      this.margins = { top: 20, bottom: 40, left: 80, right: 20 };

      this.svg = d3
        .select("#linechart")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

      // create data grouping of facilities to highlight
      this.highlightFacs = state.series.filter(d => d["highlightFac"] == "TRUE");  
      console.log("facs to highlight", this.highlightFacs);
    }
  
    draw(state, setGlobalState, highlight) {
        console.log("now I am drawing my graph");

      // draw y-axis 
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(state.series, d => d3.max(d.values))]).nice()
        .range([this.height - this.margins.bottom, this.margins.top]);

      const yAxis = d3.axisLeft(yScale);

      this.svg
          .append("g")
          .attr("class", "axis y-axis")
          .attr("transform", `translate(${this.margins.left},0)`)
          .call(yAxis)
          .append("text")
          .attr("class", "axis-label")
          .attr("y", "50%")
          .attr("dx", "-2em")
          .attr("writing-mode", "vertical-rl")
          .text("COVID-19 Cases Among Incarcerated Population");

        // draw x-axis
        const xScale = d3
          .scaleTime()
          .domain(d3.extent(state.dates))
          .range([this.margins.left, this.width - this.margins.right]);

        this.xAxis = d3.axisBottom(xScale)
          .tickFormat(d3.timeFormat("%b %Y"));

        // draw x-axis
        this.svg
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${this.height - this.margins.bottom})`)
            .call(this.xAxis);

      function hover(svg, path) {
        if ("ontouchstart" in document) svg
            .style("-webkit-tap-highlight-color", "transparent")
            .on("touchmove", moved)
            .on("touchstart", entered)
            .on("touchend", left)
        else svg
            .on("mousemove", moved)
            .on("mouseenter", entered)
            .on("mouseleave", left);
      
        const dot = svg.append("g")
            .attr("display", "none");
      
        dot.append("circle")
            .attr("r", 2.5);
      
        dot.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .attr("y", -8);
      
        function moved(event) {
          event.preventDefault();
          const pointer = d3.pointer(event, this);
          const xm = xScale.invert(pointer[0]);
          const ym = yScale.invert(pointer[1]);
          const i = d3.bisectCenter(state.dates, xm);
          const s = d3.least(state.series, d => Math.abs(d.values[i] - ym));
          path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
          dot.attr("transform", `translate(${xScale(state.dates[i])},${yScale(s.values[i])})`);
          dot.select("text").text(s.name + ", " + s.values[i]);
        }
      
        function entered() {
          path.style("mix-blend-mode", null).attr("stroke", "#ddd");
          dot.attr("display", null);
        }
      
        function left() {
          path.style("mix-blend-mode", "multiply").attr("stroke", null);
          dot.attr("display", "none");
        }
      }

      const line = d3.line()
        .defined(d => !isNaN(d))
        .x((d, i) => xScale(state.dates[i]))
        .y(d => yScale(d))

      function tweenDash() {
          const l = this.getTotalLength(),
                i = d3.interpolateString("0," + l, l + "," + l);
          return function(t) { return i(t) };
      }

      function myTransition(path) {
          path.transition()
              .duration(state.transition*8)
              .attrTween("stroke-dasharray", tweenDash)
              .ease(d3.easeLinear)
              .on("end", () => { d3.select(this).call(myTransition); });
      }

      const movingLines = this.svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("path")
        .data(state.series)
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", d => line(d.values))
        .call(myTransition);

      this.svg.call(hover, movingLines); // TO DO: how to delay this til after the lines are done being drawn? 
      return(this.svg.node());
    }
  }
  
  export { Linechart };