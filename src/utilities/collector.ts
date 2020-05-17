import {reduce} from "rxjs/operators";

export interface Collector<E> {
  [key: string]: E[];
}

/**
 * Returns an operator that collects the results from a stream into a Collector
 * class, which is a hash map that maps a key to a list of elements.
 * @param initialAccumulator
 * @param primaryKey
 */
export function collect<E>(
  initialAccumulator: Collector<E>, primaryKey: string
) {
  return reduce((acc: Collector<E>, entry: E) => {
    const list = acc[entry[primaryKey]] || [];

    list.push(entry);

    const key = entry[primaryKey];

    if (typeof key !== 'string')
      throw new Error('The result of entry[primaryKey] should be a string. Found ' + typeof key + '.');

    acc[key] = list;

    return acc
  }, initialAccumulator);
}
