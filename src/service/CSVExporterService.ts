import User from "../model/User";
import DriverTask from "../model/DriverTask";
import { CSVCreator } from "../csv/CSVCreator";
import FileDownloader from "../file/FileDownloader";

export default class CSVExporterService {
    private csvCreator: CSVCreator;
    private fileDownloader: FileDownloader;

    constructor(csvCreator: CSVCreator, fileDownloader: FileDownloader) {
        this.csvCreator = csvCreator;
        this.fileDownloader = fileDownloader;
    }

    public exportToCSV(user: User, tasks: DriverTask[], dayInterval: number): void {
        throw new Error("Not implemented");
    }
}
