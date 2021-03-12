import { Linechart } from "./js/Linechart.js";
import { CaseCount } from "./js/CaseCount.js"
// import { Linechart } from "./js/Linechart.js";
 
let linechart;
let casecount;

// global state
let state = {
    lineData: [],
    hover: null,
};

//read in data
d3.csv("./data/processed/mar9.csv", d3.autoType).then(data => {
    state.lineData = data;
    init();
  })

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
  