class Linechart {

    constructor(state, setGlobalState) {
      // initialize properties here
      this.width = window.innerWidth * 0.8;
      this.height = window.innerHeight * 0.6;
      this.margins = { top: 20, bottom: 40, left: 35, right: 20 };
      this.duration = 1000;
      this.format = d3.format(",." + d3.precisionFixed(1) + "f");
  
      this.svg = d3
        .select("#linechart")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

      // create data grouping of facilities to highlight
      this.highlightFacs = state.series.filter(d => d["highlightFac"] == "TRUE");  
      console.log("facs to highlight", this.highlightFacs);

    // this.sumstat = d3.group(state.lineData, d => d["Facility.ID"]);
    // // filter out facilities to highlight 
    // this.sumstat.delete(100)
    // // this.sumstat.delete(652)
    // this.sumstat.delete(83)
    // this.sumstat.delete(115)
    // this.sumstat.delete(113)
    // console.log("sumstat post-delete", this.sumstat);

    }
  
    draw(state, setGlobalState) {
        console.log("now I am drawing my graph");

        // only need to draw x-axis once
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(state.dates))
            .range([this.margins.left, this.width - this.margins.right]);

        this.xAxis = d3.axisBottom(xScale);

        // draw x-axis
        this.svg
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${this.height - this.margins.bottom})`)
            .call(this.xAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "50%")
            .attr("dy", "3em")
            .text("Date");
        
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(state.series, d => d3.max(d.values))]).nice()
            .range([this.height - this.margins.bottom, this.margins.top]);
  
        const yAxis = d3.axisLeft(yScale);

        // draw y-axis 
        this.svg
            .append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${this.margins.left},0)`)
            .call(yAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("y", "50%")
            .attr("dx", "-3em")
            .attr("writing-mode", "vertical-rl")
            .text("COVID-19 Cases Among Incarcerated Population");

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
          // dot.select("text").text(s.name + ", " + state.dates[i] + ", " + s.values[i]);
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
              .duration(state.transition)
              .attrTween("stroke-dasharray", tweenDash)
              .on("end", () => { d3.select(this).call(myTransition); })
              .transition()
              .style("stroke", "gray");
      }

      const path = this.svg.append("g")
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
        .style("opacity", 0)

      var t = d3.transition()
        .delay(state.transition)
        .duration(state.transition)
        .ease(d3.easeLinear);

    const pathWithTransition = this.svg.append("g")
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
      .style("opacity", 0)
      .transition(t)
      .style("opacity", 1)

      function drawHighlightLines(svg, highlightData) {
        let highlightLines = svg
        .append("g")
        .attr("class", "highlightLines")
        .selectAll("path")
        .data(highlightData)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        // .attr("opacity", 0)
        .style("mix-blend-mode", "multiply")
        .attr("d", d => line(d.values))
        .call(myTransition);
      }

      // select replay button 
      var replayButton = d3.select("button");

      // re-draw highlight lines on button click
      function replay(svg, highlightData) { 
        replayButton.on("click", function() {
        d3.selectAll("g.highlightLines").remove()
        drawHighlightLines(svg, highlightData)
        })
      }

      this.svg.call(hover, path); // hover stopped working : ( 
      // draw highlight lines the first time
      this.svg.call(drawHighlightLines, this.highlightFacs);
      // re-draw highlight lines on button click
      this.svg.call(replay, this.highlightFacs); 
      return(this.svg.node());
    }
  }
  
  export { Linechart };