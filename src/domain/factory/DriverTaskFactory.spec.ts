import 'jest';
import DriverTaskFactory from './DriverTaskFactory';
import IdGenerator from '../gen/IdGenerator';
import {
  StubbedClass,
  createSinonStubInstance,
} from '../../../test/test_helper';
import DriverTask from '../model/DriverTask';
import { DriverTaskType } from '../type/DriverTaskType';
import { DriverTaskInput } from '../input/DriverTaskInput';

describe('DriverTaskFactory', () => {
  let factory: DriverTaskFactory;
  let idGenMock: StubbedClass<IdGenerator>;

  beforeEach(() => {
    idGenMock = createSinonStubInstance(IdGenerator);
    factory = new DriverTaskFactory(idGenMock);
  });

  it('should create a driver task given inputs', () => {
    idGenMock.genID.returns(1);

    let taskInput: DriverTaskInput = {
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 3,
      day: 4,
      week: 2,
      userID: 1,
      location: 'Toronto',
    };

    let driverTask: DriverTask = factory.create(taskInput);

    expect(driverTask).toEqual(
      Object.assign(
        {
          id: 1,
        },
        taskInput,
      ) as DriverTask,
    );
  });
});
