type NumberKeyedMap<A> = { [key: number]: A };

export type Actions<A> = NumberKeyedMap<A>;

export type StateCache<S> = NumberKeyedMap<S>;

export type Reducer<S, A> = (state: S, action: A) => S;

export interface FoldCache<S, A> {
  actions: Actions<A>;
  stateCache: StateCache<S>;
  initialState: S;
  reducer: Reducer<S, A>;
}

export const makeFoldCache = <S, A>(
  initialState: S,
  reducer: Reducer<S, A>
) => ({
  actions: {},
  stateCache: {},
  initialState,
  reducer,
});

export const addAction = <S, A>(
  foldCache: FoldCache<S, A>,
  action: A,
  newKey: number
): FoldCache<S, A> =>
  fold({
    ...foldCache,
    stateCache: filterCacheKey(foldCache.stateCache, (k) => k < newKey),
    actions: { ...foldCache.actions, [newKey]: action },
  });

const filterCacheKey = <A>(
  cache: NumberKeyedMap<A>,
  f: (k: number) => boolean
): NumberKeyedMap<A> => {
  let newCache: NumberKeyedMap<A> = {};
  Object.keys(cache)
    .map(Number)
    .filter(f)
    .forEach((k) => {
      newCache[k] = cache[k];
    });
  return newCache;
};

const fold = <S, A>(foldCache: FoldCache<S, A>): FoldCache<S, A> => {
  const maxKey = getMaxKey(foldCache.stateCache) || 0;
  const actions = filterCacheKey(foldCache.actions, (k) => k > maxKey);
  const maxActionKey = getMaxKey(actions) || 0;
  const newState = keyedMapToArray(actions).reduce(
    foldCache.reducer,
    getState(foldCache)
  );
  return {
    ...foldCache,
    stateCache: { ...foldCache.stateCache, [maxActionKey]: newState },
  };
};

const keyedMapToArray = <A>(map: NumberKeyedMap<A>): A[] =>
  Object.keys(map)
    .map(Number)
    .map((k) => map[k]);

const getMaxKey = <S>(cache: StateCache<S>): number | null =>
  Object.keys(cache)
    .map(Number)
    .reduce<number | null>(
      (total, a) => (total === null ? a : Math.max(total, a)),
      null
    );

export const getState = <S, A>(foldCache: FoldCache<S, A>): S => {
  const maxKey = getMaxKey(foldCache.stateCache);
  return maxKey ? foldCache.stateCache[maxKey] : foldCache.initialState;
};

const logAction = <S, A>(
  foldCache: FoldCache<S, A>,
  action: [A, number]
): FoldCache<S, A> => {
  const newS = addAction(foldCache, action[0], action[1]);
  console.log(newS);
  return newS;
};

/*
const limitCache = <S, A>(foldCache: FoldCache<S, A>): FoldCache<S, A> => {
  // keep X highest caches
};
*/

type Action =
  | { _tag: "Up" }
  | { _tag: "Down" }
  | { _tag: "Double" }
  | { _tag: "Squared" };

type State = number;

// shittest example ever
const myFoldCache: FoldCache<State, Action> = makeFoldCache(100, (s, a) => {
  switch (a._tag) {
    case "Up":
      return s + 1;
    case "Down":
      return s - 1;
    case "Double":
      return s + s;
    case "Squared":
      return s * s;
  }
  return s;
});

const actions: [Action, number][] = [
  [{ _tag: "Up" }, 100],
  [{ _tag: "Down" }, 101],
  [{ _tag: "Up" }, 102],
  [{ _tag: "Up" }, 103],
  [{ _tag: "Up" }, 1000],
  [{ _tag: "Double" }, 104],
  [{ _tag: "Up" }, 200],
  [{ _tag: "Up" }, 300],
  [{ _tag: "Double" }, 400],
  [{ _tag: "Up" }, 1030],
  [{ _tag: "Squared" }, 105],
];

actions.reduce(logAction, myFoldCache);
