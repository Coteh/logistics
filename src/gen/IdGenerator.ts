export default class IdGenerator {
  private currID: number = 0;

  constructor(initialID?: number) {
    if (initialID) this.currID = initialID;
  }

  public genID(): number {
    return ++this.currID;
  }
}
