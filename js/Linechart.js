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
     console.log("sumstat", this.sumstat);
    }
  
    draw(state, setGlobalState) {
        console.log("now I am drawing my graph");

        const myDates = [...new Set(state.lineData.map(d => d.Date))];
        const mySumstat = this.sumstat;

        // const filteredData = state.lineData.filter(d => d["Facility.ID"] === 100);
        // console.log("filt data", filteredData);

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

        // function hover(svg, path, dates, sumDat) {

        //     if ("ontouchstart" in document) svg
        //         .style("-webkit-tap-highlight-color", "transparent")
        //         .on("touchmove", moved)
        //         .on("touchstart", entered)
        //         .on("touchend", left)
        //     else svg
        //         .on("mousemove", moved)
        //         .on("mouseenter", entered)
        //         .on("mouseleave", left);
            
        //     const dot = svg.append("g")
        //         .attr("display", "none");
            
        //     dot.append("circle")
        //         .attr("r", 2.5);
            
        //     dot.append("text")
        //         .attr("font-family", "sans-serif")
        //         .attr("font-size", 10)
        //         .attr("text-anchor", "middle")
        //         .attr("y", -8);
            
        //     function moved(event) {
        //         event.preventDefault();
        //         const pointer = d3.pointer(event, this);
        //         console.log("pointer", pointer)
        //         const xm = xScale.invert(pointer[0]);
        //         const ym = yScale.invert(pointer[1]);
        //         console.log("dates in moved", dates);
        //         // console.log("dates in moved", this.dates, d => d)
        //         // bisect = d3.bisector(this.dates, d => d[0])
        //         const i = d3.bisectCenter(dates, xm);
        //         // const s = d3.least(sumDat, d => Math.abs(d[1][i] - ym));
        //         const s = d3.least(sumDat, d => Math.abs(d.values[i] - ym));
        //         console.log("s", s);
        //         path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
        //         dot.attr("transform", `translate(${xScale(dates[i])},${yScale(s[1][i])})`);
        //         dot.select("text").text(s.key); // eventually, try and change this to be facility name + State ("Name")
        //     }
            
        //     function entered() {
        //         path.style("mix-blend-mode", null).attr("stroke", "#ddd");
        //         dot.attr("display", null);
        //     }
            
        //     function left() {
        //         path.style("mix-blend-mode", "multiply").attr("stroke", null);
        //         dot.attr("display", "none");
        //     }
        // }

        // const path = this.svg
        //     .selectAll(".path")
        //     .data(this.sumstat)
        //     .join("path")
        //     .style("mix-blend-mode", "multiply")
        //     .attr("fill", "none")
        //     .attr("stroke", "gray")
        //     .attr("stroke-width", 1.5)
        //     .attr("d", function(d){
        //       return d3.line()
        //           .defined(d => !isNaN(d.resTwoWeekAvg))
        //           .x(d => xScale(d.Date))
        //           .y(d => yScale(+d.resTwoWeekAvg))
        //           (d[1])
        //     });

        
        const lineFunc = d3
            .line()
            .defined(d => !isNaN(d.resTwoWeekAvg))
            .x(d => xScale(d.Date))
            .y(d => yScale(+d.resTwoWeekAvg))
            
        const line = this.svg
            .selectAll("path")
            .data(this.sumstat)
            .join(
              enter =>
                enter
                  .append("path")
                  .style("mix-blend-mode", "multiply")
                  .attr("class", "trend")
                  .attr("opacity", 0), // start them off as opacity 0 and fade them in
              update => update, // pass through the update selection
              exit => exit.remove()
            )
            .call(selection =>
              selection
                .transition() // sets the transition on the 'Enter' + 'Update' selections together.
                .duration(1000)
                .attr("opacity", .5)
                .attr("d", d => lineFunc(d[1]))
            );
        // this.svg.call(hover, path, myDates, mySumstat);
        return(this.svg.node());
    


  
    }
  }
  
  export { Linechart };