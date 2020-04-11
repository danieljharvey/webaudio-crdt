// this isn't really monoidal
export interface NodeId {
  _type: "OscNode";
  id: string;
}

// this is though

export type OscNodeType = "square" | "sawtooth";

export const monoidOscNodeType: Monoid<OscNodeType> = {
  mempty: "square",
  mappend: (a, b) => {
    if (b === "sawtooth") {
      return "sawtooth";
    } else {
      return a;
    }
  }
};

// we always use the last figure
export interface Frequency {
  _type: "Frequency";
  hz: number;
}

export const monoidFrequency: Monoid<Frequency> = {
  mempty: { _type: "Frequency", hz: 400 },
  mappend: (a, b) => b
};

// oh
//
export type Playing = "stop" | "start";

export const monoidPlaying: Monoid<Playing> = {
  mempty: "stop",
  mappend: (a, b) => b
};

// so is this
export interface OscNode {
  oscNodeType: OscNodeType;
  frequency: Frequency;
  playing: Playing;
}

// we'll pass this around where needed
export interface Monoid<T> {
  mempty: T;
  mappend: (a: T, b: T) => T;
}

// really this is the Last Monoid
export const monoidOscNode: Monoid<OscNode> = {
  mempty: {
    oscNodeType: monoidOscNodeType.mempty,
    frequency: monoidFrequency.mempty,
    playing: monoidPlaying.mempty
  },
  mappend: (a, b) => ({
    ...a,
    oscNodeType: monoidOscNodeType.mappend(a.oscNodeType, b.oscNodeType),
    frequency: monoidFrequency.mappend(a.frequency, b.frequency),
    playing: monoidPlaying.mappend(a.playing, b.playing)
  })
};
