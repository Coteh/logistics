export enum DriverTaskType {
    NONE,
    PICKUP,
    DELIVER,
    OTHER,
}

export function driverTaskString(type: DriverTaskType) {
    switch (type) {
        case DriverTaskType.PICKUP:
            return "Pickup Goods";
        case DriverTaskType.DELIVER:
            return "Deliver Goods";
        case DriverTaskType.OTHER:
            return "Other";
        default:
            return "Unknown Task";
    }
}
