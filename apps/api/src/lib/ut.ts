import {
  createRouteHandler,
  createUploadthing,
  UploadThingError,
  type FileRouter,
} from "uploadthing/server";
import { auth } from "./auth";
import { getContext } from "hono/context-storage";
import { Env } from "..";

const f = createUploadthing();

export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({
    pdf: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req, res }) => {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new UploadThingError("Unauthorized");
      }

      return {};
    })
    .onUploadComplete((data) => {
      console.log("upload completed", data);
    }),
} satisfies FileRouter;

export const fileHandlers = () => {
  const { env, executionCtx } = getContext<Env>();
  const handlers = createRouteHandler({
    router: uploadRouter,
    config: {
      token: env.UPLOADTHING_TOKEN,
      isDev: env.ENVIRONMENT === "development",

      fetch: (url, init) => {
        if (init && "cache" in init) delete init.cache;
        return fetch(url, init);
      },

      handleDaemonPromise: (promise) => executionCtx.waitUntil(promise),
    },
  });

  return handlers;
};

export type OurFileRouter = typeof uploadRouter;
