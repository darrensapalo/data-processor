import csv from 'csv-parser';
import fs from 'fs';
import {Observable, Subject} from "rxjs";
import {Transform} from 'stream';
import path from 'path';
/**
 * Returns an observable stream of rows from a specified CSV file.
 *
 * Defaults to skipping the first line.
 *
 * @param fileName The filename in the data-source folder.
 * @param options The options for the csv loading
 */
export function loadCsvFile(fileName: string, options: csv.Options): Observable<any> {
  return new Observable(subscriber => {
    fs.createReadStream(path.resolve('data-source', fileName))
      .pipe(csv({
        skipLines: 1,
        ...options
      }))
      .on('data', (data) => {
        subscriber.next(data);
      })
      .on('end', () => {
        subscriber.complete();
      })
      .on('error', (err) => {
        subscriber.error(err);
      });
  });
}
