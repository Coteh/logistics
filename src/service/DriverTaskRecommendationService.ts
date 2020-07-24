import { DriverTaskRepository } from '../repository/DriverTaskRepository';
import { DriverTaskInput } from '../input/DriverTaskInput';

export default class DriverTaskRecommendationService {
  private driverTaskRepo: DriverTaskRepository;

  constructor(driverTaskRepo: DriverTaskRepository) {
    this.driverTaskRepo = driverTaskRepo;
  }

  public recommendNewTime(args: DriverTaskInput) {
    throw new Error('Not implemented');
  }
}
