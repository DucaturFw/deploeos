export function toDictionary<T, V>(
  arr: T[],
  key: (obj: T) => string,
  val: (obj: T) => V
) {
  return arr.reduce((acc, cur) => ((acc[key(cur)] = val(cur)), acc), {} as {
    [key: string]: V;
  });
}
