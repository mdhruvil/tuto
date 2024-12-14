import { generateReactHelpers } from "@uploadthing/react";
import { type OurFileRouter } from "@tuto/api/lib/ut";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>({
    url: import.meta.env.VITE_API_URL + "/api/ut",
  });
