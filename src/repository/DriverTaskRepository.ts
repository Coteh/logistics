import Repository from "./Repository";
import DriverTask from "../model/DriverTask";

export class DriverTaskRepository extends Repository<DriverTask> {
    public getByUserID(userID: number): DriverTask[] {
        return Array.from(this.storage.values()).filter((task) => {
            return task.userID === userID;
        });
    }
}
