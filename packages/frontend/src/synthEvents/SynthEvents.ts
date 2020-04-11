import { DesiredState, monoidOscNode } from "@collabsynth/webaudio-diff";
import { SynthEventType } from "./types/oscillatorEvents";

export const fold = <A, B>(
  f: (acc: B, a: A) => B,
  def: B,
  map: Map<any, A>
): B => Array.from(map).reduce<B>((as, [_, a]) => f(as, a), def);

export const foldSynthEvents = (
  state: DesiredState,
  event: SynthEventType
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
            state: monoidOscNode.mempty
          }
        ]
      };
  }
  return state;
};

export const getCurrentTimestamp = () => {
  const date = new Date();
  return date.getTime();
};

export const combineSynthEvents = <A>(
  oldSynthEvents: Map<number, A>,
  newSynthEvents: Map<number, A>
): Map<number, A> => {
  return new Map([...oldSynthEvents, ...newSynthEvents]);
};
