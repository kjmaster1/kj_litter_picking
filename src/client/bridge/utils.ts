import lib, {cache} from "@overextended/ox_lib/client";

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const deepMerge = <
  T extends any[]
>(...rest: T): UnionToIntersection<T[number]> => {
  return rest.reduce((acc, curr) => {
    for (const key in curr) {
      if (
        curr[key] &&
        typeof curr[key] === 'object' &&
        !Array.isArray(curr[key])
      ) {
        // Ensure the previous value exists and is also an object
        if (!acc[key] || typeof acc[key] !== 'object') {
          acc[key] = {};
        }
        // Recursively merge nested objects
        acc[key] = deepMerge(acc[key], curr[key]);
      } else {
        // Directly assign values if not objects
        acc[key] = curr[key];
      }
    }
    return acc;
  }, {} as UnionToIntersection<T[number]>);
};

export function getPlayerData(type: string) {
  return lib.triggerServerCallback(`${cache.resource}:getplayerdata`, null, type)
}
