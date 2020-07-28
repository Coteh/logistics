/**
 * Represents a general service error
 */
export default class ServiceError extends Error {
  public type: ServiceErrorType;

  /**
   * Constructs a service error
   * @param message error message
   * @param type type of service error
   * @see ServiceErrorType
   */
  constructor(message: string, type: ServiceErrorType) {
    super(message);
    this.type = type;
  }
}

export enum ServiceErrorType {
  UNKNOWN_ERROR,
  INSUFFICIENT_PERMISSIONS,
  TASK_CONFLICT,
  INVALID_TIME_UNIT,
  ENTRY_NOT_FOUND,
  COULD_NOT_EXPORT,
  INVALID_DAY_INTERVAL,
}
