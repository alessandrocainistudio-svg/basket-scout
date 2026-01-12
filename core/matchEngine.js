// core/matchEngine.js

import { getEvents } from "./eventStore.js";

export function buildInitialState() {
  return {
    quarter: 1,
    clock: "10:00",
    players: {},
    onCourt: [],
    score: {
      home: 0,
      away: 0
    }
  };
}

export function buildMatchState() {
  const state = buildInitialState();
  const events = getEvents();

  events.forEach(event => {
    applyEvent(state, event);
  });

  return state;
}

function applyEvent(state, event) {
  switch (event.type) {

    case "START_QUARTER":
      state.clock = event.time;
      state.onCourt.forEach(num => {
        state.players[num].startTime = event.time;
      });
      break;

    case "END_QUARTER":
      state.onCourt.forEach(num => {
        const p = state.players[num];
        p.minutes += diffTime(p.startTime, "00:00");
        p.onCourt = false;
      });
      state.onCourt = [];
      state.quarter += 1;
      break;

    case "SUBSTITUTION":
      handleSubstitution(state, event);
      break;

    case "SCORE_HOME":
      state.score.home += event.points;
      break;

    case "SCORE_AWAY":
      state.score.away += event.points;
      break;
  }
}

function handleSubstitution(state, event) {
  const outP = state.players[event.out];
  const inP = state.players[event.in];

  outP.minutes += diffTime(outP.startTime, event.time);
  outP.onCourt = false;

  inP.onCourt = true;
  inP.startTime = event.time;

  state.onCourt = state.onCourt
    .filter(n => n !== event.out)
    .concat(event.in);
}

function diffTime(from, to) {
  const f = toSeconds(from);
  const t = toSeconds(to);
  return (f - t) / 60;
}

function toSeconds(t) {
  const [m, s] = t.split(":").map(Number);
  return m * 60 + s;
}
