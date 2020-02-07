import {foldEvents, actions, combineEvents} from './Events';
import {DesiredState} from '../types/State';

const emptyState: DesiredState = {
  oscillators: [],
};

describe('foldEvents', () => {
  describe('CreateOscillator', () => {
    it('When empty', () => {
      const event = actions.createOscillator({id: 'test', _type: 'OscNode'});
      expect(foldEvents(emptyState, event).oscillators).toHaveLength(1);
    });
    it('Does not duplicate', () => {
      const event = actions.createOscillator({id: 'test', _type: 'OscNode'});

      expect(
        foldEvents(foldEvents(emptyState, event), event).oscillators,
      ).toHaveLength(1);
    });
  });

  describe('SetPlaying', () => {
    it('Ignores empty', () => {
      const event = actions.setPlaying({id: 'test', _type: 'OscNode'}, 'start');
      expect(foldEvents(emptyState, event)).toEqual(emptyState);
    });

    it('Updates existing item', () => {
      const event1 = actions.createOscillator({id: 'test', _type: 'OscNode'});
      const event2 = actions.setPlaying(
        {id: 'test', _type: 'OscNode'},
        'start',
      );
      expect(
        foldEvents(foldEvents(emptyState, event1), event2).oscillators[0].state
          .playing,
      ).toEqual('start');
    });
  });

  describe('SetFrequency', () => {
    it('Ignores empty', () => {
      const event = actions.setFrequency(
        {id: 'test', _type: 'OscNode'},
        {_type: 'Frequency', hz: 100},
      );
      expect(foldEvents(emptyState, event)).toEqual(emptyState);
    });

    it('Updates existing item', () => {
      const event1 = actions.createOscillator({id: 'test', _type: 'OscNode'});
      const event2 = actions.setFrequency(
        {id: 'test', _type: 'OscNode'},
        {_type: 'Frequency', hz: 100},
      );
      expect(
        foldEvents(foldEvents(emptyState, event1), event2).oscillators[0].state
          .frequency.hz,
      ).toEqual(100);
    });
  });

  describe('SetOscNodeType', () => {
    it('Ignores empty', () => {
      const event = actions.setOscNodeType(
        {id: 'test', _type: 'OscNode'},
        'square',
      );
      expect(foldEvents(emptyState, event)).toEqual(emptyState);
    });

    it('Updates existing item', () => {
      const event1 = actions.createOscillator({id: 'test', _type: 'OscNode'});
      const event2 = actions.setOscNodeType(
        {id: 'test', _type: 'OscNode'},
        'sawtooth',
      );
      expect(
        foldEvents(foldEvents(emptyState, event1), event2).oscillators[0].state
          .oscNodeType,
      ).toEqual('sawtooth');
    });
  });
});

const first = new Map([[1, 'hello']]);

const second = new Map([[2, 'world']]);

const third = new Map([
  [1, 'nope'],
  [2, 'world'],
]);

const expected = new Map([
  [1, 'hello'],
  [2, 'world'],
]);

describe('Combine events', () => {
  it('Returns empty from empty', () => {
    expect(combineEvents(new Map(), new Map())).toEqual(new Map());
  });
  it('Combines two maps', () => {
    expect(combineEvents(first, second)).toEqual(expected);
  });
  it('Overwrites old item', () => {
    expect(combineEvents(third, first)).toEqual(expected);
  });
});
