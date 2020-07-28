/**
 * Interface for model factories
 */
export interface ModelFactory<T, I> {
  create(args: I): T;
}
