// routes/storefrontTimers.js
import express from "express";
import { getFirstActiveTimer } from "../services/timer.service.js";

const router = express.Router()

// 🕒 Get the nearest-ending active timer
router.get("/active", async (req, res) => {
  try {
    const timer = await getFirstActiveTimer(req.query.shop)
    if (!timer) return res.status(404).json({ message: "No active timer" })
    res.json(timer);
  } catch (err) {
    console.error("Error fetching active timer:", err);
    res.status(500).json({ error: "Failed to fetch active timer" })
  }
})

export default router;
