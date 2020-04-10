import {Action, reducer, getOutstanding} from './reducer';
import {initialState, State} from '../types/State';
import {EventType, actions} from '../logic/Events';

describe('Reducer', () => {
  describe('SaveEvents', () => {
    it('Combines new ones', () => {
      const action: Action = {
        type: 'SaveEvents',
        payload: {
          events: [],
        },
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });
});

const testEvent: EventType = actions.setOscNodeType(
  {_type: 'OscNode', id: 'test'},
  'square',
);

describe('getOutstanding', () => {
  it('Gets everything', () => {
    const events: Map<number, EventType> = new Map([
      [1, testEvent],
      [2, testEvent],
      [3, testEvent],
    ]);
    const state: State = {
      ...initialState,
      events,
    };
    expect(getOutstanding(state).length).toEqual(3);
  });
  it('Gets only the last one', () => {
    const events: Map<number, EventType> = new Map([
      [123, testEvent],
      [234, testEvent],
      [345, testEvent],
      [456, testEvent],
    ]);
    const state: State = {
      ...initialState,
      events,
      lastPushed: 234,
    };
    expect(getOutstanding(state).length).toEqual(2);
  });
});
