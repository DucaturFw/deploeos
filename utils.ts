export function toDictionary<T, V>(
  arr: T[],
  key: (obj: T) => string,
  val: (obj: T) => V
) {
  return arr.reduce((acc, cur) => ((acc[key(cur)] = val(cur)), acc), {} as {
    [key: string]: V;
  });
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}
