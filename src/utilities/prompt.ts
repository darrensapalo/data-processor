import {PromptObject, prompts} from "prompts";
import {Observable} from "rxjs";

export class PromptHelper {
  /**
   * Creates a new prompt for a single-select.
   * @param params
   */
  static select(params: PromptObject) {
    return new Observable(subscriber => {
      try {
        (async () => {

          const result = await prompts.select({
            type: "select",
            ...params,
          });

          subscriber.next(result);
          subscriber.complete();

        })();
      } catch (e) {
        subscriber.error(e);
      }
    })
  }
}
