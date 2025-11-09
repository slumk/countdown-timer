// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import cors from "cors";
import dotenv from "dotenv";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import AdminTimeRouter from "./timer/routes/admin.timer.router.js";
import StoreFrontRouter from "./timer/routes/storefront.timer.router.js";
import { db_connect } from "./db/init.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "3000", 10);
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// ✅ 1. Enable CORS globally (safe for dev)
app.use(cors({
  origin: true, // allow any during dev
  credentials: true,
}));

// ✅ 2. Body parser before routes
app.use(express.json());

// ✅ 3. Public storefront API (no auth)
app.use('/api/store_front/timers', StoreFrontRouter);

// ✅ 4. Shopify auth setup
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// ✅ 5. Authenticated Admin API
app.use("/api/*", shopify.validateAuthenticatedSession());
app.use('/api/admin/timers', AdminTimeRouter);

// ✅ 6. Example demo routes
app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);
  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  try {
    await productCreator(res.locals.shopify.session);
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// ✅ 7. Shopify frontend + CSP headers
app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

// ✅ 8. Error handling
app.use(errorHandler);

// ✅ 9. Fallback route for Shopify Admin iframe
app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res) => {
  res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

db_connect().then(() => app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}));
