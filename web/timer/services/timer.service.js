import Timer from "../models/Timer.js";
import { validateTimerInput, validateTimerUpdate } from "../services/timer.validator.js";

/** Create or replace global timer */
export async function createTimer(storeUrl, data) {
  validateTimerInput(data);

  await Timer.deleteMany({ storeUrl }); // ensure only one
  return await Timer.create({ ...data, storeUrl });
}

/** Get the store’s timer (admin) */
export async function getTimersForStore(storeUrl) {
  return await Timer.find({ storeUrl });
}

/** Get active timer (storefront) */
export async function getActiveTimerForStore(storeUrl) {
  const now = new Date();
  return await Timer.findOne({
    storeUrl,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
}

/** Update timer */
export async function updateTimer(storeUrl, data) {
  validateTimerUpdate(data);
  const timer = await Timer.findOneAndUpdate({ storeUrl }, data, { new: true });
  if (!timer) throw new Error("Timer not found");
  return timer;
}

/** Delete timer */
export async function deleteTimer(storeUrl) {
  const deleted = await Timer.findOneAndDelete({ storeUrl });
  if (!deleted) throw new Error("Timer not found");
  return deleted;
}
