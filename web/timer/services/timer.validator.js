import { SIZE_OPTIONS, POSITION_OPTIONS, URGENCY_OPTIONS } from "../models/Timer.js";
import { ERROR_MESSAGES } from "../constants/error_messages.js";

/**
 * Validate basic timer input on creation
 */
export function validateTimerInput(data) {
  if (!data || typeof data !== "object") {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  // Required fields
  const required = ["title", "startDate", "endDate"];
  for (const field of required) {
    if (!data[field]) throw new Error(ERROR_MESSAGES.REQUIRED_FIELD(field));
  }

  // Validate dates
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error(ERROR_MESSAGES.INVALID_DATE_FORMAT);
  }

  if (start >= end) {
    throw new Error(ERROR_MESSAGES.START_AFTER_END);
  }

  // Optional enums
  if (data.size && !SIZE_OPTIONS.includes(data.size)) {
    throw new Error(ERROR_MESSAGES.INVALID_SIZE(SIZE_OPTIONS));
  }

  if (data.position && !POSITION_OPTIONS.includes(data.position)) {
    throw new Error(ERROR_MESSAGES.INVALID_POSITION(POSITION_OPTIONS));
  }

  if (data.urgency && !URGENCY_OPTIONS.includes(data.urgency)) {
    throw new Error(ERROR_MESSAGES.INVALID_URGENCY(URGENCY_OPTIONS));
  }

  // Color validation
  if (data.color && !/^#([0-9A-F]{3}){1,2}$/i.test(data.color)) {
    throw new Error(ERROR_MESSAGES.INVALID_COLOR);
  }

  return true;
}

/**
 * Validate timer input on update
 */
export function validateTimerUpdate(data) {
  if (!data || typeof data !== "object") {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  // If dates are being updated
  if (data.startDate || data.endDate) {
    const start = data.startDate ? new Date(data.startDate) : null;
    const end = data.endDate ? new Date(data.endDate) : null;

    if (start && isNaN(start.getTime())) throw new Error(ERROR_MESSAGES.INVALID_DATE_FORMAT);
    if (end && isNaN(end.getTime())) throw new Error(ERROR_MESSAGES.INVALID_DATE_FORMAT);
    if (start && end && start >= end) throw new Error(ERROR_MESSAGES.START_AFTER_END);
  }

  // Optional enums
  if (data.size && !SIZE_OPTIONS.includes(data.size)) {
    throw new Error(ERROR_MESSAGES.INVALID_SIZE(SIZE_OPTIONS));
  }

  if (data.position && !POSITION_OPTIONS.includes(data.position)) {
    throw new Error(ERROR_MESSAGES.INVALID_POSITION(POSITION_OPTIONS));
  }

  if (data.urgency && !URGENCY_OPTIONS.includes(data.urgency)) {
    throw new Error(ERROR_MESSAGES.INVALID_URGENCY(URGENCY_OPTIONS));
  }

  if (data.color && !/^#([0-9A-F]{3}){1,2}$/i.test(data.color)) {
    throw new Error(ERROR_MESSAGES.INVALID_COLOR);
  }

  return true;
}
