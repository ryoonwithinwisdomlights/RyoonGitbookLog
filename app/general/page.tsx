"use client";
import GeneralRecordPage from "@/modules/blog/records/GeneralRecordPage";
import ResponsiveRightSlidingDrawer from "@/modules/layout/components/ResponsiveRightSlidingDrawer";
import GeneralRecordTypePageWrapper from "@/modules/layout/templates/GeneralRecordTypePageWrapper";

export default function Page() {
  const props = null;
  return (
    <GeneralRecordTypePageWrapper>
      <GeneralRecordPage />
      <ResponsiveRightSlidingDrawer props={props} />
    </GeneralRecordTypePageWrapper>
  );
}
