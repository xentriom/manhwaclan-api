import { Hono } from "hono";

const author = new Hono();

author.get("/:slug", async (c) => {
  const { slug } = c.req.param();
  return c.json({
    success: true,
    data: {
      name: "test",
      url: "test",
    },
  });
});

export default author;
