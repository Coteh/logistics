import User from '../model/User';
import { CSVCreator } from '../csv/CSVCreator';
import { DriverTaskRepository } from '../repository/DriverTaskRepository';
import { DriverTaskType } from '../type/DriverTaskType';
import ServiceError, { ServiceErrorType } from './ServiceError';
import { UserType } from '../type/UserType';

const VALID_DAY_INTERVALS = [2, 4, 7, 14, 28];

/**
 * Service for exporting drivers' tasks to CSV
 */
export default class CSVExportService {
  private csvCreator: CSVCreator;
  private driverTaskRepo: DriverTaskRepository;

  /**
   * Constructs a CSV Export service
   * @param csvCreator csv creator
   * @param driverTaskRepo driver task repository
   */
  constructor(csvCreator: CSVCreator, driverTaskRepo: DriverTaskRepository) {
    this.csvCreator = csvCreator;
    this.driverTaskRepo = driverTaskRepo;
  }

  private async checkExportPermissions(user: User) {
    if (user.type !== UserType.DISPATCHER) {
      throw new ServiceError(
        'User does not have permission to export these tasks',
        ServiceErrorType.INSUFFICIENT_PERMISSIONS,
      );
    }
  }

  /**
   * Exports driver task data to CSV as a blob
   * @param userID id of user to export data for
   * @param dayInterval interval of exports, accepted intervals are 2, 4, 7, 14, and 28
   * @param user user that is exporting data
   */
  public async exportToCSV(
    userID: number,
    dayInterval: number,
    user: User,
  ): Promise<Blob> {
    // Ensure user has permission to export
    await this.checkExportPermissions(user);
    // Ensure day interval is valid
    if (!VALID_DAY_INTERVALS.includes(dayInterval)) {
      throw new ServiceError(
        'Invalid day interval',
        ServiceErrorType.INVALID_DAY_INTERVAL,
      );
    }
    // Perform export
    let numRows: number = 364 / dayInterval;
    let data: any[][] = new Array(numRows);

    for (let i = 0; i < numRows; i++) {
      data[i] = new Array(4);
      let startDay: number = i * dayInterval + 1;
      let endDay: number = i * dayInterval + dayInterval;
      data[i][0] = `Day ${startDay} - Day ${endDay + 1}`;
      let driverData = this.driverTaskRepo.getTaskIntervalByUserID({
        userID,
        startDay,
        endDay,
      });
      data[i][1] = driverData.filter(
        (task) => task.type === DriverTaskType.PICKUP,
      ).length;
      data[i][2] = driverData.filter(
        (task) => task.type === DriverTaskType.DELIVER,
      ).length;
      data[i][3] = driverData.filter(
        (task) => task.type === DriverTaskType.OTHER,
      ).length;
    }

    try {
      return this.csvCreator.createCSVBlob(
        ['Time-Frame', 'Pickup', 'Drop-off', 'Other'],
        data,
      );
    } catch (e) {
      throw new ServiceError(
        'Error exporting CSV',
        ServiceErrorType.COULD_NOT_EXPORT,
      );
    }
  }
}
