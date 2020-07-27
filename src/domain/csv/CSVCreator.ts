/**
 * Responsible for creating CSV blobs
 */
export class CSVCreator {
  /**
   * Creates a CSV blob given header and row data
   * @param headers headers for CSV file
   * @param rows rows for CSV file
   */
  public createCSVBlob(headers: string[], rows: any[][]): Blob {
    return new Blob(
      [
        headers.join(','),
        '\n',
        rows.map((row) => row.join(',')).join('\n'),
        '\n',
      ],
      {
        type: 'text/csv',
      },
    );
  }
}
