import DriverTask from '../model/DriverTask';
import { ModelFactory } from './ModelFactory';
import { DriverTaskInput } from '../input/DriverTaskInput';
import IdGenerator from '../gen/IdGenerator';

export default class DriverTaskFactory
  implements ModelFactory<DriverTask, DriverTaskInput> {
  private idGen: IdGenerator;

  constructor(idGen: IdGenerator) {
    this.idGen = idGen;
  }

  public create(args: DriverTaskInput): DriverTask {
    return new DriverTask(
      this.idGen.genID(),
      args.type,
      args.start,
      args.end,
      args.day,
      args.week,
      args.userID,
      args.location,
    );
  }
}
