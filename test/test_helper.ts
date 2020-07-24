// https://github.com/sinonjs/sinon/issues/1963

import { createStubInstance, StubbableType, SinonStubbedInstance, SinonStubbedMember } from 'sinon';

export type StubbedClass<T> = SinonStubbedInstance<T> & T;

export function createSinonStubInstance<T>(
  constructor: StubbableType<T>,
  overrides?: { [K in keyof T]?: SinonStubbedMember<T[K]> },
): StubbedClass<T> {
  const stub = createStubInstance<T>(constructor, overrides);
  return stub as unknown as StubbedClass<T>;
}
