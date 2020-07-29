// This file is adapted from a snippet originally written by pauloavelar on GitHub
// that helps with creating stubbed test instances with sinon and TypeScript
// https://github.com/sinonjs/sinon/issues/1963

import {
  createStubInstance,
  StubbableType,
  SinonStubbedInstance,
  SinonStubbedMember,
} from 'sinon';

/**
 * StubbedClass is an extension of {@link SinonStubbedInstance} that allows it to be casted as original type without type errors.
 * Original author of this piece is pauloavelar on GitHub (https://github.com/sinonjs/sinon/issues/1963#issuecomment-497349920)
 */
export type StubbedClass<T> = SinonStubbedInstance<T> & T;

/**
 * Helper method to create sinon test stubs with all private fields intact.
 * Original author of this piece is pauloavelar on GitHub (https://github.com/sinonjs/sinon/issues/1963#issuecomment-497349920)
 * @param constructor constructor of class to stub
 * @param overrides
 * @returns stubbed instance
 */
export function createSinonStubInstance<T>(
  constructor: StubbableType<T>,
  overrides?: { [K in keyof T]?: SinonStubbedMember<T[K]> },
): StubbedClass<T> {
  const stub = createStubInstance<T>(constructor, overrides);
  return (stub as unknown) as StubbedClass<T>;
}
