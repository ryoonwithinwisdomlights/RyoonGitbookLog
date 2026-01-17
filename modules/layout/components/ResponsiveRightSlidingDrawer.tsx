"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "usehooks-ts";

const RightSlidingDrawer = dynamic(() => import("./RightSlidingDrawer"), {
  ssr: false,
});

export default function ResponsiveRightSlidingDrawer({
  props,
}: {
  // Keep loose typing to avoid propagating large notion types through client boundary.
  props: any;
}) {
  // Lighthouse runs in a mobile viewport by default. Avoid loading the entire
  // right drawer bundle (and its images) when it's never displayed.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) return null;
  return <RightSlidingDrawer props={props} />;
}

