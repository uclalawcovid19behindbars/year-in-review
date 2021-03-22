class CaseCount {

    constructor(state, setGlobalState) {
      this.container = d3.select("#casecount")
    }
  
    draw(state, setGlobalState) {
      console.log("now I am drawing my CaseCount");

      this.agg = d3.group(state.aggCounts, d => d["Date"]);
      console.log("date data", this.agg)

      const myCount = this.container
        .append("p")
        .text("this is some text")
        .style("font-family", "var(--sans-serif)")
        .style("font-variant-numeric", "tabular-nums");


      myCount
        .select("p")
        .transition()
        .duration(this.duration)
        .textTween(function(d) {
          const i = d3.interpolate(0, 400000);
          return function(t) { return format(i(t)); };
        })
        // .text(10)


      // while (true) {
      //   yield myCount.node();
      //   await myCount.transition()
      //       .duration(state.transition)
      //       .textTween(() => t => `t = ${t.toFixed(400000)}`)
      //     .end();
      // }

    //   const metric = this.container
    //     .selectAll("div.metric")
    //     .data(metricData, d => d.State)
    //     .join(
    //       enter => 
    //         enter
    //           .append("div")
    //           .attr("class", "metric")
    //           .call(enter => enter.append("div").attr("class", "title"))
    //           .call(enter => enter.append("div").attr("class", "number")),
    //         update => update,
    //         exit => exit.remove()
    //     ).on("click", d => {
    //       setGlobalState({ selectedMetric: d.metric });
    //     })
  
    //   metric.select("div.title")
    //     .text(d => d.metric)
  
    //   const format = d3.format(",." + d3.precisionFixed(1) + "f")
  
    //   metric.select("div.number")
    //     // reference: https://observablehq.com/@d3/transition-texttween
    //     .transition()
    //     .duration(this.duration)
    //     .style("color", d => d.metric === state.selectedMetric ? "purple" : "#ccc")
    //     .textTween(function(d) {
    //       const i = d3.interpolate(0, d.value);
    //       return function(t) { return format(i(t)); };
    //     })
    }
  }
  
  export { CaseCount };