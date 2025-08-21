import { Hono } from "hono";
import { randomHeader } from "../utils/headers.js";
import { httpClient } from "../utils/constants.js";
import { ApiError } from "../utils/errors.js";

const imageRoutes = new Hono();

imageRoutes.get("/:url", async (c) => {
  const url = c.req.param("url");

  if (!url || !url.startsWith("http")) {
    throw new ApiError("Invalid URL", 400);
  }

  const { data, headers } = await httpClient.get(url, {
    headers: randomHeader(),
    responseType: "arraybuffer",
    timeout: 10000,
  });

  let contentType = headers["content-type"];
  if (!contentType) {
    const urlLower = url.toLowerCase();
    if (urlLower.includes(".jpg") || urlLower.includes(".jpeg")) {
      contentType = "image/jpeg";
    } else if (urlLower.includes(".png")) {
      contentType = "image/png";
    } else if (urlLower.includes(".gif")) {
      contentType = "image/gif";
    } else if (urlLower.includes(".webp")) {
      contentType = "image/webp";
    } else {
      contentType = "application/octet-stream";
    }
  }

  // Set CORS headers for cross-origin requests
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET");
  c.header("Access-Control-Allow-Headers", "Content-Type");
  c.header("Cache-Control", "public, max-age=3600"); // Cache for 1 hour

  return c.body(data, 200, {
    "Content-Type": contentType,
  });
});

export default imageRoutes;
