"use client";
import BasicRecordPage from "@/modules/blog/records/BasicRecordPage";
import ResponsiveRightSlidingDrawer from "@/modules/layout/components/ResponsiveRightSlidingDrawer";
import GeneralRecordTypePageWrapper from "@/modules/layout/templates/GeneralRecordTypePageWrapper";

export default function Page() {
  const props = null;
  return (
    <GeneralRecordTypePageWrapper>
      <BasicRecordPage />
      <ResponsiveRightSlidingDrawer props={props} />
    </GeneralRecordTypePageWrapper>
  );
}
