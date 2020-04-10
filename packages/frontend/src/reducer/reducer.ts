import {State, WebAudioState, DesiredState} from '../types/State';
import {Postable, EventType, combineEvents} from '../logic/Events';

interface SaveEvents {
  type: 'SaveEvents';
  payload: {events: [number, EventType][]};
}

interface AddEvent {
  type: 'AddEvent';
  payload: {
    timestamp: number;
    evt: EventType;
  };
}

interface UpdateAudioTree {
  type: 'UpdateAudioTree';
  payload: {
    webAudio: WebAudioState;
    desiredState: DesiredState;
  };
}

interface SetLastPushed {
  type: 'SetLastPushed';
  payload: {
    timestamp: number;
  };
}

export type Action = SaveEvents | AddEvent | UpdateAudioTree | SetLastPushed;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SaveEvents':
      // sdfsdfsdf
      const newEventsMap = new Map(action.payload.events);
      return {
        ...state,
        events: combineEvents(state.events, newEventsMap),
      };

    case 'AddEvent':
      // sdfsdfsdf
      const events = new Map(state.events).set(
        action.payload.timestamp,
        action.payload.evt,
      );
      return {
        ...state,
        events,
      };

    case 'UpdateAudioTree':
      return {
        ...state,
        data: action.payload.desiredState,
        webAudio: action.payload.webAudio,
      };

    case 'SetLastPushed':
      return {
        ...state,
        lastPushed: action.payload.timestamp,
      };
  }
  return state;
};

export const getMaxKey = (state: State): number =>
  Array.from(state.events.keys()).reduce((a, b) => Math.max(a, b), 0);

export const getOutstanding = (state: State): Postable[] =>
  Array.from(state.events)
    .filter(a => a[0] > (state.lastPushed || 0))
    .map(a => ({timestamp: a[0], event: a[1]}));
