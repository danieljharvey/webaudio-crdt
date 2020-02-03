import * as Types from "../types/Types";
import { initialDesiredState, DesiredState } from "../types/State";

import axios from "axios";

interface EventShape<k, a> {
  kind: k;
  payload: a;
}

interface CreateOscillator {
  nodeId: Types.NodeId;
}

const createOscillator = (nodeId: Types.NodeId): EventType => ({
  kind: "CreateOscillator",
  payload: {
    nodeId
  }
});

interface SetPlaying {
  nodeId: Types.NodeId;
  playing: Types.Playing;
}

const setPlaying = (
  nodeId: Types.NodeId,
  playing: Types.Playing
): EventType => ({
  kind: "SetPlaying",
  payload: {
    nodeId,
    playing
  }
});

interface SetFrequency {
  nodeId: Types.NodeId;
  frequency: Types.Frequency;
}

const setFrequency = (
  nodeId: Types.NodeId,
  frequency: Types.Frequency
): EventType => ({
  kind: "SetFrequency",
  payload: {
    nodeId,
    frequency
  }
});

interface SetOscNodeType {
  nodeId: Types.NodeId;
  oscNodeType: Types.OscNodeType;
}

const setOscNodeType = (
  nodeId: Types.NodeId,
  oscNodeType: Types.OscNodeType
): EventType => ({
  kind: "SetOscNodeType",
  payload: {
    nodeId,
    oscNodeType
  }
});

export type EventType =
  | EventShape<"SetPlaying", SetPlaying>
  | EventShape<"CreateOscillator", CreateOscillator>
  | EventShape<"SetFrequency", SetFrequency>
  | EventShape<"SetOscNodeType", SetOscNodeType>;

export const actions = {
  createOscillator,
  setPlaying,
  setFrequency,
  setOscNodeType
};

export const fold = <A, B>(
  f: (acc: B, a: A) => B,
  def: B,
  map: Map<any, A>
): B => Array.from(map).reduce<B>((as, [_, a]) => f(as, a), def);

export const foldEvents = (
  state: DesiredState,
  event: EventType
): DesiredState => {
  switch (event.kind) {
    case "SetPlaying":
      return {
        ...state,
        oscillators: state.oscillators.map(osc => {
          if (osc.nodeId.id === event.payload.nodeId.id) {
            return {
              ...osc,
              state: {
                ...osc.state,
                playing: event.payload.playing
              }
            };
          }
          return osc;
        })
      };
    case "SetFrequency":
      return {
        ...state,
        oscillators: state.oscillators.map(osc => {
          if (osc.nodeId.id === event.payload.nodeId.id) {
            return {
              ...osc,
              state: {
                ...osc.state,
                frequency: event.payload.frequency
              }
            };
          }
          return osc;
        })
      };
    case "SetOscNodeType":
      return {
        ...state,
        oscillators: state.oscillators.map(osc => {
          if (osc.nodeId.id === event.payload.nodeId.id) {
            return {
              ...osc,
              state: {
                ...osc.state,
                oscNodeType: event.payload.oscNodeType
              }
            };
          }
          return osc;
        })
      };
    case "CreateOscillator":
      return {
        ...state,
        oscillators: [
          ...state.oscillators.filter(
            a => a.nodeId.id !== event.payload.nodeId.id
          ),
          {
            nodeId: event.payload.nodeId,
            state: Types.monoidOscNode.mempty
          }
        ]
      };
  }
  return state;
};

const fetchEvents = () =>
  axios
    .get("http://localhost:3006/events")
    .then(a => a.data)
    .catch(e => {
      console.error("Could not fetch!");
    });

interface Postable {
  timestamp: number;
  event: EventType;
}

const postEvents = (postable: Postable[]) =>
  axios
    .post("http://localhost:3006/pushEvents", { items: postable })
    .catch(console.error);

const getCurrentTimestamp = () => {
  const date = new Date();
  return date.getTime();
};

export const dispatchEvent = (
  getEvents: () => Map<number, EventType>,
  setEvents: (evts: Map<number, EventType>) => void
) => (evt: EventType): void => {
  const oldEvents = getEvents();
  const events = oldEvents.set(getCurrentTimestamp(), evt);
  console.log("event list", events.size);
  setEvents(new Map(events));
};

type Return = [number, EventType][];

export const fetchRemoteEvents = (
  getEvents: () => Map<number, EventType>,
  setEvents: (evts: Map<number, EventType>) => void
) => {
  /*
  setInterval(() => {
    fetchEvents().then((newEvents: Return) => {
      const newEventsMap = new Map(newEvents);
      const oldEvents = getEvents();
      const allEvents = new Map([...oldEvents, ...newEventsMap]);
      console.log("event list", allEvents.size);
      setEvents(allEvents);
    });
  }, 5000);
*/
  /*setInterval(() => {

    // console.log(`posting ${outstanding.length} events`);
    postEvents(outstanding).then(_ => (outstanding = []));
  }, 1000);*/
};
