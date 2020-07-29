/**
 * Represents a type of driver task
 */
export enum DriverTaskType {
  NONE,
  PICKUP,
  DELIVER,
  OTHER,
}

/**
 * Converts driver task type enum value to string value
 * @param type driver task type
 * @returns stringified driver task type
 */
export function driverTaskString(type: DriverTaskType) {
  switch (type) {
    case DriverTaskType.PICKUP:
      return 'Pickup Goods';
    case DriverTaskType.DELIVER:
      return 'Deliver Goods';
    case DriverTaskType.OTHER:
      return 'Other';
    default:
      return 'Unknown Task';
  }
}
