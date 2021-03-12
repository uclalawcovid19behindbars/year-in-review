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

    }
  
    draw(state, setGlobalState) {
        console.log("now I am drawing my graph");

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

        //  const lineFunc = d3.line()
        //      .defined(d => !isNaN(d))
        //      .x(d => xScale(d.Date))
        //      .y(d => yScale(d.resTwoWeekAvg));
            
        // console.log(lineFunc("2020-12-13", 13));

        this.svg
            .selectAll(".path")
            .data(this.sumstat)
            .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
              return d3.line()
                  .defined(d => !isNaN(d.resTwoWeekAvg))
                  .x(d => xScale(d.Date))
                  .y(d => yScale(+d.resTwoWeekAvg))
                  (d[1])
            });
        return(this.svg.node());


  
    }
  }
  
  export { Linechart };