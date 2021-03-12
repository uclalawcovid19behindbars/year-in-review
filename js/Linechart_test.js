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

    this.grpData = d3.group(state.lineData, d => d["Facility.ID"])
    console.log("grped lines", this.grpData);

    // this.small_dat = this.grpData.get(100)

      // only need to draw x-axis once
      this.xScale = d3
        .scaleTime()
        .domain(d3.extent(state.lineData, d => d.Date))
        .range([this.margins.left, this.width - this.margins.right]);

      this.xAxis = d3.axisBottom(this.xScale);

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

    }
  
    draw(state, setGlobalState) {
        console.log("now I am drawing my graph");

        const filteredData = state.lineData.filter(d => d["Facility.ID"] === 100);
        console.log("filt data", filteredData);
        
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

        const x = d3.scaleTime().range([this.margins.left, this.width - this.margins.right]);
        const y = d3.scaleLinear().range([this.height - this.margins.bottom, this.margins.top]);

         const lineFunc = d3.line()
             .defined(d => !isNaN(d))
             .x(d => this.xScale(d.Date))
             .y(d => yScale(d.resTwoWeekAvg));
            

        console.log(lineFunc("2020-12-13", 13));

            const line = this.svg
             .selectAll("path.trend")
             .data([filteredData])
             .join(
               enter =>
                 enter
                   .append("path")
                   .attr("class", "trend")
                   .attr("opacity", 0), // start them off as opacity 0 and fade them in
               update => update, // pass through the update selection
               exit => exit.remove()
             )
             .call(selection =>
               selection
                 .transition() // sets the transition on the 'Enter' + 'Update' selections together.
                 .duration(1000)
                 .attr("opacity", 1)
                 .attr("d", d => lineFunc(d))
             );


        // this.svg
        //     .selectAll(".line")
        //     .data(this.grpData)
        //     .enter()
        //     .append("path")
        //     .attr("fill", "none")
        //     .attr("stroke", "red")
        //     .attr("stroke-width", 1.5)
        //     .attr("d", function(d){
        //     return d3.line()
        //         .x(function(d) { return this.xScale(d.Date); })
        //         .y(function(d) { return yScale(+d.resTwoWeekAvg); })
        //         (d.values)
        //     })


  
    }
  }
  
  export { Linechart };