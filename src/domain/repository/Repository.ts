import Model from '../model/Model';

/**
 * Represents a generic in-memory data repository
 */
export default class Repository<T extends Model> {
  protected storage: Map<number, T>;

  /**
   * Constructs a data repository
   */
  constructor() {
    this.storage = new Map();
  }

  /**
   * Gets an entry from repository
   * @param key identifier of data
   * @returns repository entry
   */
  public get(key: number): T {
    if (!this.storage.has(key)) {
      throw new Error(`Item with key ${key} not found`);
    }
    return this.storage.get(key)!;
  }

  /**
   * Adds an entry to repository
   * @param key identifier of data
   * @param item item to add
   */
  public add(key: number, item: T): void {
    this.storage.set(key, item);
  }

  /**
   * Deletes an entry from repository
   * @param key identifier of data
   */
  public delete(key: number): void {
    if (!this.storage.has(key)) {
      throw new Error(`Item with key ${key} not found`);
    }
    this.storage.delete(key);
  }
}
