import express from "express";
import { getActiveTimerForStore } from "../services/timer.service.js";

const StoreFrontRouter = express.Router();

/**
 * GET /storefront/timer/active?shop=store.myshopify.com
 */
StoreFrontRouter.get("/timer/active", async (req, res) => {
  try {
    const timer = await getActiveTimerForStore(req.storeUrl);
    if (!timer) return res.json(null)

    res.json({
      id: timer._id,
      title: timer.title,
      description: timer.description,
      startDate: timer.startDate,
      endDate: timer.endDate,
      color: timer.color,
      size: timer.size,
      position: timer.position,
      urgency: timer.urgency,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default StoreFrontRouter;
