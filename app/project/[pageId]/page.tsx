import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG } from "@/blog.config";
import { getARecordPageById } from "@/lib/notion/controller";
import SingleRecords from "@/modules/blog/records/SingleRecords";
import ErrorComponent from "@/modules/common/components/shared/ErrorComponent";
import ResponsiveRightSlidingDrawer from "@/modules/layout/components/ResponsiveRightSlidingDrawer";
import GeneralRecordTypePageWrapper from "@/modules/layout/templates/GeneralRecordTypePageWrapper";

// NOTE:
// This page uses Upstash Redis during render (POST /pipeline), which Next.js
// considers "no-store" and therefore cannot be statically rendered/ISR'd.
// Force SSR to avoid `DYNAMIC_SERVER_USAGE` errors on Vercel.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageId: string }>;
}): Promise<Metadata> {
  const { pageId } = await params;

  const props = await getARecordPageById({
    pageId,
    from: "PROJECT-page-metadata",
    type: "PROJECT",
  });
  if (!props) {
    notFound();
  }
  const title = props?.page?.title;
  const pageTitle = title ? title : "";
  return {
    title: pageTitle,
    description: BLOG.DESCRIPTION as string,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;

  if (!pageId) {
    return <ErrorComponent />;
  }

  const result = await getARecordPageById({
    pageId,
    from: "PROJECT-page",
    type: "PROJECT",
  });

  if (!result?.page) {
    return <div>Invalid Page Id</div>;
  }

  // const page = await setPrevNextRecommendInRecordPage(result);

  return (
    <GeneralRecordTypePageWrapper>
      <SingleRecords props={result} />
      <ResponsiveRightSlidingDrawer props={result} />
    </GeneralRecordTypePageWrapper>
  );
}
