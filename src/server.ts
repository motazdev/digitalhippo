import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";
import nextBuild from "next/dist/build";
import path from "path";
import { PayloadRequest } from "payload/types";
import { parse } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "https://digitalhippo-kohl-nine.vercel.app",
    credentials: true,
  })
);
const PORT = Number(process.env.PORT) || 3000;
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  console.log("req.headers ::: ", req.headers);
  console.log("req.cookies ::: ", req.cookies);
  return {
    req,
    res,
  };
};

export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type WebhookRequest = IncomingMessage & { rawBody: Buffer };
const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);
  const initializeServer = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  const cartRouter = express.Router();
  cartRouter.use(payload.authenticate);
  cartRouter.get("/", (req, res) => {
    const request = req as PayloadRequest;
    if (!request.user) return res.redirect("/sign-in?origin=cart");
    const parsedUrl = parse(req.url, true);
    return nextApp.render(req, res, "/cart", parsedUrl.query);
  });

  app.use("/cart", cartRouter);

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.all("*", (req, res) => nextHandler(req, res));

  await nextApp.prepare();
  return app;
};

// Export the serverless handler for Vercel
export default async (req: any, res: any) => {
  const app = await initializeServer();
  return app(req, res);
};
