import { Action, reducer, getOutstanding } from "./reducer";
import { initialState, State } from "./state";
import { SynthEventType, oscillatorActions } from "../synthEvents";

describe("Reducer", () => {
  describe("SaveSynthEvents", () => {
    it("Combines new ones", () => {
      const action: Action = {
        type: "SaveSynthEvents",
        payload: {
          events: []
        }
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });
});

const testSynthEvent: SynthEventType = oscillatorActions.setOscNodeType(
  { _type: "OscNode", id: "test" },
  "square"
);

describe("getOutstanding", () => {
  it("Gets everything", () => {
    const events: Map<number, SynthEventType> = new Map([
      [1, testSynthEvent],
      [2, testSynthEvent],
      [3, testSynthEvent]
    ]);
    const state: State = {
      ...initialState,
      events
    };
    expect(getOutstanding(state).length).toEqual(3);
  });
  it("Gets only the last one", () => {
    const events: Map<number, SynthEventType> = new Map([
      [123, testSynthEvent],
      [234, testSynthEvent],
      [345, testSynthEvent],
      [456, testSynthEvent]
    ]);
    const state: State = {
      ...initialState,
      events,
      lastPushed: 234
    };
    expect(getOutstanding(state).length).toEqual(2);
  });
});
