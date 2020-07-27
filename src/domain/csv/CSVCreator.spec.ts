import 'jest';
import { CSVCreator } from './CSVCreator';
import { blobToString } from '../../../test/util/blob_helper';

describe('CSVCreator', () => {
  let creator: CSVCreator;

  beforeEach(() => {
    creator = new CSVCreator();
  });

  it('creates a valid CSV blob', async () => {
    expect(
      await blobToString(
        creator.createCSVBlob(
          ['test', 'test2'],
          [
            ['cell1', 'cell2'],
            ['cell3', 'cell4'],
          ],
        ),
      ),
    ).toEqual('test,test2\ncell1,cell2\ncell3,cell4\n');
  });
  it('sets number data as rows', async () => {
    expect(
      await blobToString(creator.createCSVBlob(['test', 'test2'], [[14, 16]])),
    ).toContain('14,16');
  });
});
