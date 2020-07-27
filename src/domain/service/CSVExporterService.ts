import User from '../model/User';
import DriverTask from '../model/DriverTask';
import { CSVCreator } from '../csv/CSVCreator';
import FileDownloader from '../file/FileDownloader';

export default class CSVExporterService {
  private csvCreator: CSVCreator;

  constructor(csvCreator: CSVCreator) {
    this.csvCreator = csvCreator;
  }

  public exportToCSV(
    user: User,
    tasks: DriverTask[],
    dayInterval: number,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      reject({
        message: 'Not implemented',
      });
    });
  }
}
