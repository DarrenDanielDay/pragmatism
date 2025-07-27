import { isFunction } from "./language";

export const repeat = <T>(arr: T[], times: number) => {
  const res: T[] = [];
  for (let i = 0; i < times; i++) {
    for (const item of arr) {
      res.push(item);
    }
  }
  return res;
};

export const repeatFor = <T>(times: number, ...[arg]: [item: T] | [factory: (i: number) => T]) => {
  return Array.from({ length: times }, (_, i) => (isFunction(arg) ? arg(i) : arg));
};

export const append = <T>(dist: T[], addon: T[]) => {
  for (const element of addon) {
    dist.push(element);
  }
  return dist;
};

export const cycleAt = <T>(arr: T[], i: number) => {
  return arr.at(i % arr.length);
};

export const shuffle = <T>(arr: T[]) => {
  return arr.sort(() => Math.random() - 0.5);
};

export const perfectShuffle = <T>(a: T[], b: T[]) => {
  let ai = a.length,
    bi = b.length,
    putA = true;
  const deck: T[] = [];
  while (ai > 0 || bi > 0) {
    if (putA && ai > 0) {
      ai--;
      deck.push(a[ai]!);
    } else if (bi > 0) {
      bi--;
      deck.push(b[bi]!);
    }
    putA = !putA;
  }
  return append(deck, (putA ? b.slice(0, bi) : a.slice(0, ai)).reverse()).reverse();
};
