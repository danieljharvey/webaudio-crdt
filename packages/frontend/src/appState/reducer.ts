import { DesiredState, WebAudioDiffState } from "@collabsynth/webaudio-diff";
import { State } from "./state";
import { SynthEventType, combineSynthEvents } from "../synthEvents";
import { Postable } from "../synthEvents/api";

interface SaveSynthEvents {
  type: "SaveSynthEvents";
  payload: { events: [number, SynthEventType][] };
}

interface AddSynthEvent {
  type: "AddSynthEvent";
  payload: {
    timestamp: number;
    evt: SynthEventType;
  };
}

interface UpdateAudioTree {
  type: "UpdateAudioTree";
  payload: {
    diffState: WebAudioDiffState;
    desired: DesiredState;
  };
}

interface SetLastPushed {
  type: "SetLastPushed";
  payload: {
    timestamp: number;
  };
}

export type Action =
  | SaveSynthEvents
  | AddSynthEvent
  | UpdateAudioTree
  | SetLastPushed;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SaveSynthEvents":
      // sdfsdfsdf
      const newSynthEventsMap = new Map(action.payload.events);
      return {
        ...state,
        events: combineSynthEvents(state.events, newSynthEventsMap)
      };

    case "AddSynthEvent":
      // sdfsdfsdf
      const events = new Map(state.events).set(
        action.payload.timestamp,
        action.payload.evt
      );
      return {
        ...state,
        events
      };

    case "UpdateAudioTree":
      return {
        ...state,
        audioDiff: {
          desired: action.payload.desired,
          webAudio: action.payload.diffState.webAudio
        }
      };

    case "SetLastPushed":
      return {
        ...state,
        lastPushed: action.payload.timestamp
      };
  }
  return state;
};

export const getMaxKey = (state: State): number =>
  Array.from(state.events.keys()).reduce((a, b) => Math.max(a, b), 0);

export const getOutstanding = (state: State): Postable[] =>
  Array.from(state.events)
    .filter(a => a[0] > (state.lastPushed || 0))
    .map(a => ({ timestamp: a[0], event: a[1] }));
