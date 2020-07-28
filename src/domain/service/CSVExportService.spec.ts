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
import ServiceError, { ServiceErrorType } from './ServiceError';
import { DriverTaskType } from '../type/DriverTaskType';

describe('CSVExportService', () => {
  let service: CSVExportService;
  let csvMock: StubbedClass<CSVCreator>;
  let driverTaskRepo: DriverTaskRepository;

  function populateTestData() {
    driverTaskRepo.add(1, {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 3,
      day: 1,
      week: 1,
      location: 'Toronto',
      userID: 1,
    });
    driverTaskRepo.add(2, {
      id: 2,
      type: DriverTaskType.DELIVER,
      start: 3,
      end: 5,
      day: 1,
      week: 1,
      location: 'Toronto',
      userID: 1,
    });
    driverTaskRepo.add(3, {
      id: 3,
      type: DriverTaskType.OTHER,
      start: 6,
      end: 7,
      day: 1,
      week: 1,
      location: 'Toronto',
      userID: 1,
    });
    driverTaskRepo.add(4, {
      id: 4,
      type: DriverTaskType.PICKUP,
      start: 8,
      end: 9,
      day: 1,
      week: 1,
      location: 'Toronto',
      userID: 1,
    });
    driverTaskRepo.add(5, {
      id: 5,
      type: DriverTaskType.PICKUP,
      start: 1,
      end: 3,
      day: 2,
      week: 1,
      location: 'Toronto',
      userID: 1,
    });
    driverTaskRepo.add(6, {
      id: 6,
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 3,
      day: 3,
      week: 1,
      location: 'Toronto',
      userID: 1,
    });
    driverTaskRepo.add(7, {
      id: 7,
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 3,
      day: 1,
      week: 5,
      location: 'Toronto',
      userID: 1,
    });
  }

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
      csvMock.createCSVBlob.callThrough();

      return service
        .exportToCSV(1, 2, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csv: string[] = (await blobToString(csvBlob)).split('\n');
          expect(csv[1]).toContain('Day 1 - Day 3');
          expect(csv[364 / 2]).toContain('Day 363 - Day 365');
        });
    });
    it('produces a CSV file displaying data in 4 day denominations', () => {
      csvMock.createCSVBlob.callThrough();

      return service
        .exportToCSV(1, 4, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csv: string[] = (await blobToString(csvBlob)).split('\n');
          expect(csv[1]).toContain('Day 1 - Day 5');
          expect(csv[364 / 4]).toContain('Day 361 - Day 365');
        });
    });
    it('produces a CSV file displaying data in 7 day denominations', () => {
      csvMock.createCSVBlob.callThrough();

      return service
        .exportToCSV(1, 7, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csv: string[] = (await blobToString(csvBlob)).split('\n');
          expect(csv[1]).toContain('Day 1 - Day 8');
          expect(csv[364 / 7]).toContain('Day 358 - Day 365');
        });
    });
    it('produces a CSV file displaying data in 14 day denominations', () => {
      csvMock.createCSVBlob.callThrough();

      return service
        .exportToCSV(1, 14, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csv: string[] = (await blobToString(csvBlob)).split('\n');
          expect(csv[1]).toContain('Day 1 - Day 15');
          expect(csv[364 / 14]).toContain('Day 351 - Day 365');
        });
    });
    it('produces a CSV file displaying data in 28 day denominations', () => {
      csvMock.createCSVBlob.callThrough();

      return service
        .exportToCSV(1, 28, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csv: string[] = (await blobToString(csvBlob)).split('\n');
          expect(csv[1]).toContain('Day 1 - Day 29');
          expect(csv[364 / 28]).toContain('Day 337 - Day 365');
        });
    });
    it('displays expected number of tasks in CSV', () => {
      csvMock.createCSVBlob.callThrough();
      populateTestData();
      return service
        .exportToCSV(1, 2, new User(1, UserType.DISPATCHER))
        .then(async (csvBlob) => {
          const csv: string[] = (await blobToString(csvBlob)).split('\n');
          // Day 1 - Day 3
          expect(csv[1]).toContain(',2,2,1');
          // Day 3 - Day 5
          expect(csv[2]).toContain(',0,1,0');
          // Day 5 - Day 7
          expect(csv[3]).toContain(',0,0,0');
          // Day 7 - Day 9
          expect(csv[4]).toContain(',0,0,0');
          // Day 27 - Day 29
          expect(csv[14]).toContain(',0,0,0');
          // Day 29 - Day 31
          expect(csv[15]).toContain(',0,1,0');
          // Day 31 - Day 33
          expect(csv[16]).toContain(',0,0,0');
        });
    });
    it('throws a service error if invalid day interval specified', async () => {
      await expect(
        service.exportToCSV(1, 12, new User(1, UserType.DISPATCHER)),
      ).rejects.toThrow(ServiceError);
    });
    it('reports an invalid day interval error if invalid day interval specified', () => {
      return service
        .exportToCSV(1, 12, new User(1, UserType.DISPATCHER))
        .then(() => {
          fail('Exported with invalid day interval');
        })
        .catch((err: ServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.INVALID_DAY_INTERVAL);
        });
    });
    it('throws a service error if driver attempts to export CSV', async () => {
      await expect(
        service.exportToCSV(1, 28, new User(1, UserType.DRIVER)),
      ).rejects.toThrow(ServiceError);
    });
    it('reports an insufficient permissions error if driver attempts to export CSV', () => {
      return service
        .exportToCSV(1, 28, new User(1, UserType.DRIVER))
        .then(() => {
          fail('Driver exported CSV');
        })
        .catch((err: ServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.INSUFFICIENT_PERMISSIONS);
        });
    });
    it('throws a service error if csv export failed', async () => {
      csvMock.createCSVBlob.throws(new Error('Error creating CSV'));

      await expect(
        service.exportToCSV(1, 28, new User(1, UserType.DISPATCHER)),
      ).rejects.toThrow(ServiceError);
    });
    it("should report a 'could not export' error if csv export failed", () => {
      csvMock.createCSVBlob.throws(new Error('Error creating CSV'));

      return service
        .exportToCSV(1, 28, new User(1, UserType.DISPATCHER))
        .then(() => {
          fail('Exported a nonexistent CSV');
        })
        .catch((err: ServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.COULD_NOT_EXPORT);
        });
    });
  });
});
