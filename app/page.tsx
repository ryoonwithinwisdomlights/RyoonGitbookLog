"use client";
import ArchiveIntro from "@/modules/blog/records/ArchiveIntro";
import ResponsiveRightSlidingDrawer from "@/modules/layout/components/ResponsiveRightSlidingDrawer";
import GeneralRecordTypePageWrapper from "@/modules/layout/templates/GeneralRecordTypePageWrapper";

export default function Page() {
  const props = null;
  return (
    <GeneralRecordTypePageWrapper>
      <ArchiveIntro />
      <ResponsiveRightSlidingDrawer props={props} />
    </GeneralRecordTypePageWrapper>
  );
}
