class CaseCount {

    constructor(state, setGlobalState) {
      this.container = d3.select("#casecount")
    }
  
    draw(state, setGlobalState) {

      const myCount = this.container
        .append("p")
        .attr("class", "metric")
        .style("font-family", "var(--sans-serif)")
        .style("font-variant-numeric", "tabular-nums")
        .property("_current", 395529)

      const formatNumber = d3.format(",.2r") 

      myCount.transition()
        .ease(d3.easeLinear)
        .duration(state.transition)
        .tween("text", function(d) {
          var that = this;
          var i = d3.interpolate(0, 395529);  
          return function(t) {
              d3.select((that))
                .text(formatNumber(i(t)));
          };
        })

    }
  }
  
  export { CaseCount };