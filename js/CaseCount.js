class CaseCount {

    constructor(state, setGlobalState) {
      this.container = d3.select("#casecount")
    }
  
    draw(state, setGlobalState) {
      console.log("now I am drawing my CaseCount");

      const myCount = this.container
        .append("p")
        .style("font-family", "var(--sans-serif)")
        .style("font-variant-numeric", "tabular-nums");

      const format = d3.format(",.2r") // where to put this? 

      myCount.transition()
        .ease(d3.easeLinear)
        .duration(state.transition)
        .tween("text", function(d) {
          var that = this;
          var i = d3.interpolate(0, 395529);  // Number(d.percentage.slice(0, -1))
          return function(t) {
              d3.select((that))
                .text(i(t)
                .toFixed(0)
                );
          };
        })
    }
  }
  
  export { CaseCount };