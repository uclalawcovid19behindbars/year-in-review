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
        .style("font-family", "var(--sans-serif)")
        .style("font-variant-numeric", "tabular-nums");

        myCount.transition()
          .ease(d3.easeLinear)
          .duration(2000)
          .tween("text", function(d) {
            var that = this;
            var i = d3.interpolate(0, 90);  // Number(d.percentage.slice(0, -1))
            return function(t) {
                d3.select(that).text(i(t).toFixed(2));
            };
          })
    }
  }
  
  export { CaseCount };