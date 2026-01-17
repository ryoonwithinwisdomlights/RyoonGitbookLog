import { BLOG } from "@/blog.config";
import { getGlobalRecordPageData } from "@/lib/notion/serviceImpl";
import { BaseArchivePageBlock } from "@/types/record.model";
import type { MetadataRoute } from "next";
type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

/**
 *
 * Good to know:
 * sitemap.js is a special Route Handlers
 * that is cached by default unless it uses a Dynamic API or dynamic config option.
 *
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = new URL(BLOG.LINK);
  const globalData = await getGlobalRecordPageData({
    pageId: BLOG.NOTION_DATABASE_ID as string,
  });
  const dailyVariable: ChangeFrequency = "daily";

  const urls: MetadataRoute.Sitemap = [
    {
      url: baseUrl.toString(),
      lastModified: new Date(),
      changeFrequency: dailyVariable,
      priority: 1,
    },
    {
      url: new URL("/records", baseUrl).toString(),
      lastModified: new Date(),
      changeFrequency: dailyVariable,
      priority: 1,
    },
    {
      url: new URL("/project", baseUrl).toString(),
      lastModified: new Date(),
      changeFrequency: dailyVariable,
      priority: 1,
    },
    {
      url: new URL("/engineering", baseUrl).toString(),
      lastModified: new Date(),
      changeFrequency: dailyVariable,
      priority: 1,
    },
  ];
  // Cycle page generation
  const { allPages } = globalData as { allPages?: BaseArchivePageBlock[] };
  allPages
    ?.filter(
      (p: BaseArchivePageBlock) =>
        p.status === BLOG.NOTION_PROPERTY_NAME.status_publish
    )
    .forEach((record: BaseArchivePageBlock) => {
      const lastModified = record.lastEditedDate
        ? new Date(record.lastEditedDate)
        : record.date?.start_date
          ? new Date(record.date.start_date)
          : new Date();
      urls.push({
        url: new URL(`/${record.type.toLowerCase()}/${record.id}`, baseUrl).toString(),
        lastModified,
        changeFrequency: dailyVariable,
        priority: 1,
      });
    });

  return urls;
}
