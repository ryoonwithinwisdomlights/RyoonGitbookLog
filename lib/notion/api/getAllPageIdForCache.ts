/* eslint-disable no-unused-vars */

import { notion_api } from "@/lib/notion/api/notion";
import { CollectionQueryResult } from "notion-types";
import { getTextContent, idToUuid } from "notion-utils";

type NotionBlockMap = Record<
  string,
  {
    value?: {
      type?: string;
      properties?: Record<string, unknown>;
      collection_id?: string;
      view_ids?: string[];
    };
  }
>;

export async function getAllPageIdForCache(
  databasePageId: string
): Promise<string[]> {
  const uuidedPageId = idToUuid(databasePageId);
  const recordMap = await notion_api.getPage(databasePageId);
  const blockMap = (recordMap.block || {}) as NotionBlockMap;
  const rootBlock = blockMap[uuidedPageId]?.value;

  if (!rootBlock) {
    console.error(`[getAllPageIds] No root block found for ${databasePageId}`);
    return [];
  }

  if (
    rootBlock.type !== "collection_view_page" &&
    rootBlock.type !== "collection_view"
  ) {
    console.error(`[getAllPageIds] Page ${databasePageId} is not a collection`);
    return [];
  }

  const collectionId = rootBlock.collection_id;
  const viewIds = rootBlock.view_ids;
  const collectionQuery = recordMap.collection_query;

  if (!collectionId || !viewIds || !collectionQuery?.[collectionId]) {
    console.error(
      `[getAllPageIds] Missing collection data for ${databasePageId}`
    );
    return [];
  }

  //const numSet = new Set([1, 2, 3]); // Set(3) {1, 2, 3} 집합 리턴.
  const pageSet = new Set<string>();

  setOnlyPageTypeBlockMap(blockMap, pageSet);
  return [...pageSet];
}

function setOnlyPageTypeBlockMap(blockMap: NotionBlockMap, pageSet: Set<string>) {
  Object.entries(blockMap).forEach(([id, block]) => {
    const value = block.value;
    if (value?.type !== "page") return;

    const properties = (value.properties || {}) as Record<string, unknown>;
    const statusRaw = properties["status"] || properties["Status"];
    const status = getTextContent(statusRaw as any);

    if (status?.toLowerCase() === "published") {
      pageSet.add(id);
    }
  });
}

function setAllBlockMap(
  viewIds: string[],
  collectionQuery: Record<string, any>,
  collectionId: string,
  pageSet: Set<string>
) {
  // First attempt: preferred View's blockIds
  for (const viewId of viewIds) {
    const viewQuery: CollectionQueryResult =
      collectionQuery[collectionId]?.[viewId];
    if (!viewQuery) continue;

    const groupResults = (viewQuery as CollectionQueryResult)
      ?.collection_group_results?.blockIds;
    const normalBlocks = (viewQuery as CollectionQueryResult)?.blockIds;

    if (groupResults?.length) {
      groupResults.forEach((id: string) => pageSet.add(id));
    }
    if (normalBlocks?.length) {
      normalBlocks.forEach((id: string) => pageSet.add(id));
    }
  }
}
