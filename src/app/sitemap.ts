import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/about",
    "/reviews",
    "/quote",
    "/schedule",
    "/login",
    "/signup",
    "/dashboard",
    "/admin",
  ];

  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/quote" || route === "/schedule" ? 0.9 : 0.6,
  }));
}
