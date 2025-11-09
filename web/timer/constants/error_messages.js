export const ERROR_MESSAGES = {
  REQUIRED_FIELD: (field) => `${field} is required`,
  INVALID_DATE_FORMAT: "Invalid startDate or endDate format",
  START_AFTER_END: "startDate must be earlier than endDate",
  INVALID_SIZE: (options) => `Invalid size. Must be one of: ${options.join(", ")}`,
  INVALID_POSITION: (options) => `Invalid position. Must be one of: ${options.join(", ")}`,
  INVALID_URGENCY: (options) => `Invalid urgency. Must be one of: ${options.join(", ")}`,
  INVALID_COLOR: "Invalid color format. Expected HEX value like #FF0000",
  INVALID_INPUT: "Invalid input data",
};
