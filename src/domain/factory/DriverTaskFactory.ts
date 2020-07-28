import DriverTask from '../model/DriverTask';
import { ModelFactory } from './ModelFactory';
import { DriverTaskInput } from '../input/DriverTaskInput';
import IdGenerator from '../gen/IdGenerator';

/**
 * Factory that creates {@link DriverTask} instances
 */
export default class DriverTaskFactory
  implements ModelFactory<DriverTask, DriverTaskInput> {
  private idGen: IdGenerator;

  /**
   * Constructs a driver task factory
   * @param idGen id generator
   */
  constructor(idGen: IdGenerator) {
    this.idGen = idGen;
  }

  /**
   * Create a new {@link DriverTask} instance
   * @param args information for a new driver task
   */
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
