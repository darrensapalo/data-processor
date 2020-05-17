/**
 * Applies a function over a 2D array.
 * @param a an array of size M of type E
 * @param b an array of size N of type F
 * @param operation
 * @returns an array of size MxN with type Result
 */
export function apply2DMap<E, F, Result>(a: E[], b: F[], operation: (left: E, right: F) => Result) {

  const results: Result[][] = [];

  for (let i = 0; i < a.length; i++) {
    results[i] = [];
    const first = a[i];

    for (let j = 0; j < b.length; j++) {
      const second = b[j];

      results[i][j] = operation(first, second);
    }
  }

  return results;
}
