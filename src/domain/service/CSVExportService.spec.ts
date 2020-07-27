import 'jest';
import CSVExportService from './CSVExportService';
import {
  StubbedClass,
  createSinonStubInstance,
} from '../../../test/util/stub_class';
import { CSVCreator } from '../csv/CSVCreator';
import { DriverTaskRepository } from '../repository/DriverTaskRepository';
import User from '../model/User';
import { UserType } from '../type/UserType';
import { blobToString } from '../../../test/util/blob_helper';

describe('CSVExportService', () => {
  let service: CSVExportService;
  let csvMock: StubbedClass<CSVCreator>;
  let driverTaskRepo: DriverTaskRepository;

  beforeEach(() => {
    csvMock = createSinonStubInstance(CSVCreator);
    driverTaskRepo = new DriverTaskRepository();
    service = new CSVExportService(csvMock, driverTaskRepo);
  });

  describe('exportToCSV', () => {
    it('produces an exported CSV file', () => {
      return service.exportToCSV(1, 2, new User(1, UserType.DISPATCHER));
    });
    it('produces an exported CSV file with expected headers', () => {
      csvMock.createCSVBlob.callThrough();

      return service
        .exportToCSV(1, 2, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csvText: string = await blobToString(csvBlob);
          expect(csvText.split('\n')[0]).toEqual(
            'Time-Frame,Pickup,Drop-off,Other',
          );
        });
    });
    it('produces a CSV file displaying data in 2 day denominations', () => {
      return service
        .exportToCSV(1, 2, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csvText: string = await blobToString(csvBlob);
          expect(csvText.split('\n')[1]).toContainEqual('Day 1 - Day 3');
        });
    });
    it('produces a CSV file displaying data in 4 day denominations', () => {
      return service
        .exportToCSV(1, 2, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csvText: string = await blobToString(csvBlob);
          expect(csvText.split('\n')[1]).toContainEqual('Day 1 - Day 5');
        });
    });
    it('produces a CSV file displaying data in 7 day denominations', () => {
      return service
        .exportToCSV(1, 2, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csvText: string = await blobToString(csvBlob);
          expect(csvText.split('\n')[1]).toContainEqual('Day 1 - Day 8');
        });
    });
    it('produces a CSV file displaying data in 14 day denominations', () => {
      return service
        .exportToCSV(1, 2, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csvText: string = await blobToString(csvBlob);
          expect(csvText.split('\n')[1]).toContainEqual('Day 1 - Day 15');
        });
    });
    it('produces a CSV file displaying data in 28 day denominations', () => {
      return service
        .exportToCSV(1, 2, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csvText: string = await blobToString(csvBlob);
          expect(csvText.split('\n')[1]).toContainEqual('Day 1 - Day 27');
        });
    });
    it('displays expected number of pickup tasks in CSV', () => {
      throw new Error('Not implemented');
    });
    it('displays expected number of drop-off tasks in CSV', () => {
      throw new Error('Not implemented');
    });
    it('displays expected number of other tasks in CSV', () => {
      throw new Error('Not implemented');
    });
    it('throws an error if invalid day interval specified', () => {
      throw new Error('Not implemented');
    });
    it('throws an error if driver attempts to export CSV', () => {
      throw new Error('Not implemented');
    });
    it('throws an error if csv export failed', () => {
      throw new Error('Not implemented');
    });
  });
});
