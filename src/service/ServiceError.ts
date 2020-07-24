export default interface ServiceError {
  message: string;
  type: ServiceErrorType;
}

export enum ServiceErrorType {
  UNKNOWN_ERROR,
  INSUFFICIENT_PERMISSIONS,
  TASK_CONFLICT,
  INVALID_TIME_SLOT,
}
