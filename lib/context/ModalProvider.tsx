"use client";

import SettingModal from "@/modules/common/components/modals/SettingModal";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "sonner";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  const handleMount = useCallback(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    handleMount();
  }, [handleMount]);

  // none of the modals are gonna be rendered unless we are fully on the client side.
  if (!isMounted) return null;

  return (
    <>
      <SettingModal />
      <Toaster position="bottom-right"  />
    </>
  );
};
