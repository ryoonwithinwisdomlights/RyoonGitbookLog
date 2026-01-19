"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { BLOG } from "@/blog.config";
import { usePathname, useSearchParams } from "next/navigation";

// Dynamic import - react-share is heavy bundle
const ShareButtons = dynamic(() => import("./ShareButtons"), {
  ssr: false,
  loading: () => <div className="h-8 w-32 animate-pulse bg-neutral-200 rounded" />,
});

const ShareBar = ({ record }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memoize share URL and body calculations
  const shareUrl = useMemo(
    () => BLOG.LINK + `${pathname}?${searchParams}`,
    [pathname, searchParams]
  );

  const shareBody = useMemo(
    () =>
      record?.title +
      " | " +
      BLOG.TITLE +
      " " +
      shareUrl +
      " " +
      record?.summary,
    [record?.title, record?.summary, shareUrl]
  );

  if (
    !JSON.parse(BLOG.RECORD_SHARE_BAR_ENABLE) ||
    !record ||
    record?.type === "CONFIG" ||
    record?.type === "Menu" ||
    record?.type === "SubMenu" ||
    record?.type === "Notice" ||
    record?.type === "Page" ||
    record?.status !== "Published"
  ) {
    return <></>;
  }

  return (
    <div className="m-1 overflow-x-auto">
      <div className="flex w-full md:justify-end">
        <ShareButtons
          shareUrl={shareUrl}
          title={record.title}
          image={record.pageCover}
          body={shareBody}
        />
      </div>
    </div>
  );
};

export default ShareBar;
