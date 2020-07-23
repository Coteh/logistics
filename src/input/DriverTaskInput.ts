import { DriverTaskType } from "../type/DriverTaskType";

export interface DriverTaskInput {
    type: DriverTaskType;
    start: number;
    end: number;
    day: number;
    userID: number;
    location: string;
}
