/**
 * Generates ids for new items such as driver tasks
 */
export default class IdGenerator {
  private currID: number = 0;

  /**
   * Constructs an id generator
   * @param initialID id to start at
   */
  constructor(initialID?: number) {
    if (initialID) this.currID = initialID;
  }

  /**
   * Generate next id
   * @returns generated id
   */
  public genID(): number {
    return ++this.currID;
  }
}
