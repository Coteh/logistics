export default class IdGenerator {
    private currID: number = 0;

    public genID(): number {
        return this.currID++;
    }
}
