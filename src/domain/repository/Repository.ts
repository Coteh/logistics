import Model from '../model/Model';

export default class Repository<T extends Model> {
  protected storage: Map<number, T>;

  constructor() {
    this.storage = new Map();
  }

  public get(key: number): T {
    if (!this.storage.has(key)) {
      throw new Error(`Item with key ${key} not found`);
    }
    return this.storage.get(key)!;
  }

  public add(key: number, item: T) {
    this.storage.set(key, item);
  }

  public delete(key: number) {
    if (!this.storage.has(key)) {
      throw new Error(`Item with key ${key} not found`);
    }
    this.storage.delete(key);
  }
}
