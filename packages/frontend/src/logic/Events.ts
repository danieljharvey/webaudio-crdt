import * as Types from "../types/Types";
import { State, initialDesiredState, DesiredState } from "../types/State";
import { Action, getOutstanding, getMaxKey } from "../reducer/reducer";

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

export const fetchEvents = () =>
  axios
    .get("http://localhost:3006/events")
    .then(a => a.data)
    .catch(e => {
      console.error("Could not fetch!");
    });

export interface Postable {
  timestamp: number;
  event: EventType;
}

export const postEvents = (postable: Postable[]) =>
  axios
    .post("http://localhost:3006/pushEvents", { items: postable })
    .catch(console.error);

export const getCurrentTimestamp = () => {
  const date = new Date();
  return date.getTime();
};

type Return = [number, EventType][];

export const combineEvents = <A>(
  oldEvents: Map<number, A>,
  newEvents: Map<number, A>
): Map<number, A> => {
  return new Map([...oldEvents, ...newEvents]);
};
