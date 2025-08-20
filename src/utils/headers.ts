import UserAgent from "user-agents";

export const randomHeader = () => ({
  "User-Agent": new UserAgent().toString(),
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://manhwaclan.com/",
  Connection: "keep-alive",
});
