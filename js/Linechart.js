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

    this.sumstat = d3.group(state.lineData, d => d["Facility.ID"]);
    // filter out facilities to highlight 
    this.sumstat.delete(100)
    // this.sumstat.delete(652)
    this.sumstat.delete(83)
    this.sumstat.delete(115)
    this.sumstat.delete(113)
    console.log("sumstat post-delete", this.sumstat);

    // create new group with facilities to highlight 
    const highlightFac1 = state.lineData.filter(d => d["Facility.ID"] == 100);  // san quentin
    // const highlightFac2 = state.lineData.filter(d => d["Facility.ID"] == 652); // bellamy creek
    const highlightFac3 = state.lineData.filter(d => d["Facility.ID"] == 83);   // avenal state prison
    const highlightFac4 = state.lineData.filter(d => d["Facility.ID"] == 115); // ca correctional training facility 
    const highlightFac5 = state.lineData.filter(d => d["Facility.ID"] == 113); // chuckawalla valley training 
    // const highlightFacs = highlightFac1.concat(highlightFac2, highlightFac3, highlightFac4, highlightFac5)
    const highlightFacs = highlightFac1.concat(highlightFac3, highlightFac4, highlightFac5)


    this.highlightGrp = d3.group(highlightFacs, d => d["Facility.ID"])

    this.tooltip = d3
      .select("#linechart")
      .style("position", "relative")
      .append("div")
      .attr("class", "tooltip")
      .attr("width", 100)
      .attr("height", 100)
      .style("position", "absolute");

    }
  
    draw(state, setGlobalState) {
        console.log("now I am drawing my graph");

        const myDates = [...new Set(state.lineData.map(d => d.Date))];
        const mySumstat = this.sumstat;

        // only need to draw x-axis once
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(state.lineData, d => d.Date))
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
            .domain([0, d3.max(state.lineData, d => +d.resTwoWeekAvg)])
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
                  const i = d3.bisectCenter(myDates, xm);
                //   const s = d3.least(data.series, d => Math.abs(d.values[i] - ym));
                  const s = d3.least(mySumstat, d => Math.abs(d));
                  console.log("s", s)
                  path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
                //   dot.attr("transform", `translate(${xScale(myDates[i])},${yScale(s.values[i])})`);
                  dot.attr("transform", `translate(${xScale(myDates[i])},${yScale(s[i])})`);
                  dot.select("text").text(s);
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

        const lineFunc = d3
            .line()
            .defined(d => !isNaN(d.resTwoWeekAvg))
            .x(d => xScale(d.Date))
            .y(d => yScale(+d.resTwoWeekAvg))

        function tweenDash() {
            const l = this.getTotalLength(),
                  i = d3.interpolateString("0," + l, l + "," + l);
            return function(t) { return i(t) };
          }

        function myTransition(path) {
            path.transition()
                .duration(state.transition)
                .attrTween("stroke-dasharray", tweenDash)
                .on("end", () => { d3.select(this).call(myTransition); });
          }

        // simplest way to put all the lines on the page 
        const path = this.svg
            .append("g")
            .attr("class", "allLines")
            .selectAll(".path")
            .data(this.sumstat)
            .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 1.5)
            .attr("opacity", .3)
            .attr("d", d => lineFunc(d[1]));

        
          // add the dots with tooltips
          const formatTime = d3.timeFormat("%B %e");

          const div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

            this.svg
                .selectAll("dot")
                .data(state.lineData)
                .join("circle")
                .attr("r", 1)
                .attr("cx", function(d) { return xScale(d.Date); })
                .attr("cy", function(d) { return yScale(d.resTwoWeekAvg); })
                .on("mouseover", function(event,d) {
                    div.transition()
                    // .duration(200)
                    .style("opacity", .9);
                    div.html(formatTime(d.Date) + "<br/>" + d.Name)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
                    })
                .on("mouseout", function(d) {
                    div.transition()
                    // .duration(500)
                    .style("opacity", 0);
                    });
    
        // this.svg.call(hover, path);

        // draw lines in an animated but kinda clunky way 
          const attentionFacs = this.svg
            .append("g")
            .attr("class", "highlightLines")
            .selectAll("path")
            .data(this.highlightGrp)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .attr("opacity", 1)
            .style("mix-blend-mode", "multiply")
            .attr("d", d => lineFunc(d[1]))
            .call(myTransition)

        // needs work 
        // attentionFacs
        //     .select("text")
        //     .attr("dy", "-.5em")
        //     .text(d => `${d.Name}: ${d.State}`);

        return(this.svg.node());
    
    }
  }
  
  export { Linechart };