import { loadCsvFile } from '../../loaders/load-csv';
import { zip } from 'rxjs';
import { tap, toArray, map } from 'rxjs/operators';
import { createLogger } from '../../utilities/logger';

const tableA = [];
const tableB = [];

const two = loadCsvFile('registrant_ids_of_access_pass_BIGGER_SET-part-two.csv', {
  headers: ['id']
})
    .pipe(
        map(r => r.id),
        tap(entry => {
            tableA.push(entry);
        }),
        toArray()
    );

const one = loadCsvFile('registrant_ids_of_access_pass_SMALLER_SET.csv', {
  headers: ['registrant_id']
})
    .pipe(
        map(r => r.registrant_id),
        tap(entry => {
            tableB.push(entry);
        }),
        toArray()
    );

const logger = createLogger("registrants", 'warn');

zip(one, two).subscribe({
  complete:  () => {

    let count = 0;
    const result = tableA.filter(value => {
      count++;
      if (count % 10000 === 0)
        logger.info(value);
      return !tableB.includes(value);
    });

    result.forEach(v => {
      logger.warn(v);
    })
  }
});
