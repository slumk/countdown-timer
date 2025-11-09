import express from "express";
import {
  createTimer,
  getTimersForStore,
  updateTimer,
  deleteTimer,
} from "../services/timer.service.js";

const router = express.Router();

/**
 * Middleware to extract storeId from header
 * (In production this will come from session, but dev uses header)
 */
router.use(async (req, res, next) => {
  req.storeURL = req.query.shop
  next();
});

/** GET store’s timer */
router.get("/", async (req, res) => {
  try {
    const timer = await getTimersForStore(req.storeURL);
    res.json(timer || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** POST create/replace timer */
router.post("/", async (req, res) => {
  try {
    const timer = await createTimer(req.storeURL, req.body);
    res.status(201).json(timer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** PUT update timer */
router.put("/", async (req, res) => {
  try {
    const timer = await updateTimer(req.storeURL, req.body);
    res.json(timer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** DELETE remove timer */
router.delete("/", async (req, res) => {
  try {
    await deleteTimer(req.storeURL);
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
