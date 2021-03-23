import { Linechart } from "./js/Linechart.js";
import { CaseCount } from "./js/CaseCount.js"
// import { Linechart } from "./js/Linechart.js";
 
let linechart;
let casecount;

// global state
let state = {
    lineData: [],
    aggCounts: [],
    transition: 7000,
    hover: null,
};

//read in data
// d3.csv("./data/processed/mar9.csv", d3.autoType).then(data => {
//     state.lineData = data;
//     init();
//   })

Promise.all([
  d3.csv("./data/processed/agg_counts.csv", d3.autoType),
  d3.csv("./data/processed/mar9.csv", d3.autoType),
]).then(([aggCounts, lineData]) => {
  state.aggCounts = aggCounts;
  state.lineData = lineData;
  // console.log("state: ", state);
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
  