import { Linechart } from "./js/Linechart.js";
import { CaseCount } from "./js/CaseCount.js"
 
let linechart;
let casecount;

// global state
let state = {
    series: [],
    dates: [],
    transition: 3000*8,
    hover: null,
};

Promise.all([
  d3.csv("./data/processed/cumulative_cases_wide.csv", d3.autoType),
]).then(([lineData]) => {
  const columns = lineData.columns.slice(2);
  state.dates = columns.map(d3.timeParse("%Y-%m-%d"));
  state.series = lineData.map(d => ({
    name: d.NameToShow,
    highlightFac: d.highlightFac,
    values: columns.map(k => +d[k])
  }))
  console.log("state: ", state);
  init();
});

function init() {
  linechart = new Linechart(state, setGlobalState);
  casecount = new CaseCount(state, setGlobalState);
  draw();
}

function draw() {
    linechart.draw(state, setGlobalState);
    casecount.draw(state, setGlobalState);
  }

// state-updating function
function setGlobalState(nextState) {
    state = { ...state, ...nextState };
    console.log("new state:", state);
    draw();
  }
  