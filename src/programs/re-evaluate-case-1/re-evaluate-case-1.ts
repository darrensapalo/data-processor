import {loadCsvFile} from '../../loaders/load-csv';
import {
  mergeMap,
  map,
  concatMap
} from 'rxjs/operators';
import {from, Observable} from 'rxjs';
import {createLogger} from "../../utilities/logger";
import distance from 'jaro-winkler';
import {collect} from "../../utilities/collector";
import {apply2DMap} from "../../utilities/2d-map";
import { InvestigatedCaseOneSet, CaseOneSet, InvestigationResult } from './interfaces';


const case1EntriesLogger = createLogger("case-1.entries.log", 'info');
const case2EntriesLogger = createLogger("case-2.entries.log", 'info');

const caseOneEntrySet = loadCsvFile('case_1_deletions.csv', {
  headers: ["id", "reference_id", "registrant_id", "name"]
})
  .pipe(
    collect({} as CaseOneSet, 'reference_id')
  );

function investigate(container: InvestigatedCaseOneSet, index: number): Observable<InvestigatedCaseOneSet> {

  return new Observable(subscriber => {
    let names : string[] = [];

    container.set.forEach(value => {
      names.push(value.name);
    });

    names = names.map(name => name.toUpperCase());

    let result: any;
    let isConfirmed: boolean = false;


    const distances = apply2DMap<string, string, number>(names, names, distance);

    let b : number[] = distances.reduce((acc, cur) => {
      cur.forEach((e, i) => acc[i] = acc[i] ? acc[i] + e : e);
      return acc;
    }, []).map(e => e / distances.length);

    // console.log('avg');
    // console.log(b);
    const average = b.reduce((acc, val) => acc + val) / b.length;
    // console.log("average");

    const THRESHOLD = 1;

    if (average < THRESHOLD) {

      /*
      do {

        const percentage = index / 15000;
        const progress = percentage.toFixed(2);
        console.log();
        console.log();
        console.log();
        console.log(`[${index} - ${progress}] Names: ` + names.join(", "));
        console.log();

        result = await prompts.select({
          type: "select",
          name: "classification",
          message: "Are these the same people?",
          choices: [
            {
              title: "Yes, same people",
              value: "case 2"
            },
            {
              title: "No, different people",
              value: "case 1"
            }
          ]
        })

        const decision = result === 'case 1' ? 'different people' : 'the same people';

        isConfirmed = await prompts.confirm({
          type: "confirm",
          name: "reallySure",
          message: `Are you sure ${names.join(", ")} are ${decision}?`,
          choices: [
            {
              title: "No",
              value: false
            },
            {
              title: "Yes",
              value: true
            }
          ]
        }) as any
      } while(isConfirmed === false);
      */

      result = null;
      case1EntriesLogger.info(container.reference_id);
    } else {
      result = 'case 2';
      case2EntriesLogger.info(container.reference_id);
    }

    if (result === 'case 1') {
      container.messages.push(InvestigationResult.CaseOne);
      subscriber.complete();
    }else if (result === 'case 2') {
      container.messages.push(InvestigationResult.CaseTwo);
      subscriber.next(container);
      subscriber.complete();
    } else {
      subscriber.complete();
    }
  });
}

const duplicates$ = caseOneEntrySet.pipe(
  mergeMap((set: CaseOneSet) => {

    const caseOneEntries$: Observable<string> = from(Object.keys(set));

    return caseOneEntries$.pipe(map((key: string) => {
      return {
        messages: [],
        reference_id: key,
        set: set[key]
      } as InvestigatedCaseOneSet;
    }))
  }),
  concatMap((container, index) => investigate(container, index)),
);



duplicates$
  .pipe(
  )
  .subscribe((caseOnes) => {

    const mobileNumber = caseOnes.reference_id;

    const instances = caseOnes.set.length;

    const decision = caseOnes.messages;

    // logger.info(`For ${mobileNumber}, there were ${instances} instances. Decision: ${decision}`);
  });
