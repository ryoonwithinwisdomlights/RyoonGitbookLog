import { BLOG } from "@/blog.config";
import { getAllPageIdForCache } from "@/lib/notion/api/getAllPageIdForCache";

function normalizePageIdForRoute(pageId: string): string {
  // Our internal links often use the 32-char form (no dashes).
  return pageId.replace(/-/g, "");
}

export async function getStaticPageParams(): Promise<Array<{ pageId: string }>> {
  const databaseId = BLOG.NOTION_DATABASE_ID;
  const limit = BLOG.NEXT_STATIC_PARAMS_LIMIT;

  if (!databaseId) return [];

  try {
    const ids = await getAllPageIdForCache(databaseId as string);
    return ids.slice(0, limit).map((id) => ({ pageId: normalizePageIdForRoute(id) }));
  } catch (err) {
    console.warn("[generateStaticParams] failed to fetch page ids:", err);
    return [];
  }
}

