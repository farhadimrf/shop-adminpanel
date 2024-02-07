"use client";
import { useStoreModal } from "@/hooks/use-stroe-modal";
import { useEffect } from "react";

const HomePage = () => {
   const { onOpen, isOpen } = useStoreModal();
   useEffect(() => {
      if (!isOpen) onOpen();
   }, [isOpen, onOpen]);
   return null;
};

export default HomePage;
