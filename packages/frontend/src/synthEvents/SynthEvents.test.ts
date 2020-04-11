import {
  foldSynthEvents,
  oscillatorActions,
  combineSynthEvents
} from "./index";
import { DesiredState } from "@collabsynth/webaudio-diff";

const emptyState: DesiredState = {
  oscillators: []
};

describe("foldSynthEvents", () => {
  describe("CreateOscillator", () => {
    it("When empty", () => {
      const event = oscillatorActions.createOscillator({
        id: "test",
        _type: "OscNode"
      });
      expect(foldSynthEvents(emptyState, event).oscillators).toHaveLength(1);
    });
    it("Does not duplicate", () => {
      const event = oscillatorActions.createOscillator({
        id: "test",
        _type: "OscNode"
      });

      expect(
        foldSynthEvents(foldSynthEvents(emptyState, event), event).oscillators
      ).toHaveLength(1);
    });
  });

  describe("SetPlaying", () => {
    it("Ignores empty", () => {
      const event = oscillatorActions.setPlaying(
        { id: "test", _type: "OscNode" },
        "start"
      );
      expect(foldSynthEvents(emptyState, event)).toEqual(emptyState);
    });

    it("Updates existing item", () => {
      const event1 = oscillatorActions.createOscillator({
        id: "test",
        _type: "OscNode"
      });
      const event2 = oscillatorActions.setPlaying(
        { id: "test", _type: "OscNode" },
        "start"
      );
      expect(
        foldSynthEvents(foldSynthEvents(emptyState, event1), event2)
          .oscillators[0].state.playing
      ).toEqual("start");
    });
  });

  describe("SetFrequency", () => {
    it("Ignores empty", () => {
      const event = oscillatorActions.setFrequency(
        { id: "test", _type: "OscNode" },
        { _type: "Frequency", hz: 100 }
      );
      expect(foldSynthEvents(emptyState, event)).toEqual(emptyState);
    });

    it("Updates existing item", () => {
      const event1 = oscillatorActions.createOscillator({
        id: "test",
        _type: "OscNode"
      });
      const event2 = oscillatorActions.setFrequency(
        { id: "test", _type: "OscNode" },
        { _type: "Frequency", hz: 100 }
      );
      expect(
        foldSynthEvents(foldSynthEvents(emptyState, event1), event2)
          .oscillators[0].state.frequency.hz
      ).toEqual(100);
    });
  });

  describe("SetOscNodeType", () => {
    it("Ignores empty", () => {
      const event = oscillatorActions.setOscNodeType(
        { id: "test", _type: "OscNode" },
        "square"
      );
      expect(foldSynthEvents(emptyState, event)).toEqual(emptyState);
    });

    it("Updates existing item", () => {
      const event1 = oscillatorActions.createOscillator({
        id: "test",
        _type: "OscNode"
      });
      const event2 = oscillatorActions.setOscNodeType(
        { id: "test", _type: "OscNode" },
        "sawtooth"
      );
      expect(
        foldSynthEvents(foldSynthEvents(emptyState, event1), event2)
          .oscillators[0].state.oscNodeType
      ).toEqual("sawtooth");
    });
  });
});

const first = new Map([[1, "hello"]]);

const second = new Map([[2, "world"]]);

const third = new Map([
  [1, "nope"],
  [2, "world"]
]);

const expected = new Map([
  [1, "hello"],
  [2, "world"]
]);

describe("Combine events", () => {
  it("Returns empty from empty", () => {
    expect(combineSynthEvents(new Map(), new Map())).toEqual(new Map());
  });
  it("Combines two maps", () => {
    expect(combineSynthEvents(first, second)).toEqual(expected);
  });
  it("Overwrites old item", () => {
    expect(combineSynthEvents(third, first)).toEqual(expected);
  });
});
