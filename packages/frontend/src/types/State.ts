import * as Types from "./Types";
import { EventType } from "../logic/Events";

interface EmptyWebAudioState {
  context: null;
}

export interface StartedWebAudioState {
  context: AudioContext;
  oscillators: { [key: string]: OscillatorNode };
}

export type WebAudioState = EmptyWebAudioState | StartedWebAudioState;

// oscillator with node info
export interface OscillatorWithNode {
  nodeId: Types.NodeId;
  state: Types.OscNode;
}

export const initialWebAudioState: WebAudioState = {
  context: null
};

// tree for diffing
export interface DesiredState {
  oscillators: OscillatorWithNode[];
}

export const initialDesiredState: DesiredState = {
  oscillators: []
};

// main state type

export interface State {
  webAudio: WebAudioState;
  data: DesiredState;
  events: Map<number, EventType>;
  lastPushed: number | null;
}

export const initialState: State = {
  webAudio: { context: null },
  data: initialDesiredState,
  events: new Map(),
  lastPushed: null
};
