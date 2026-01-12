// core/eventStore.js

let events = [];

export function addEvent(event) {
  events.push(event);
}

export function undoLastEvent() {
  events.pop();
}

export function getEvents() {
  return [...events];
}

export function clearEvents() {
  events = [];
}
