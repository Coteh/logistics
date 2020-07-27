import User from '../model/User';
import { CSVCreator } from '../csv/CSVCreator';
import { DriverTaskRepository } from '../repository/DriverTaskRepository';
import { DriverTaskType } from '../type/DriverTaskType';

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
    let numRows: number = Math.floor(365 / dayInterval);
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

    return this.csvCreator.createCSVBlob(
      ['Time-Frame', 'Pickup', 'Drop-off', 'Other'],
      data,
    );
  }
}
