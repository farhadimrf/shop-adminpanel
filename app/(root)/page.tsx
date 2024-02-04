"use client";
import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-stroe-modal";
import { useEffect } from "react";

const HomePage = () => {
   const { onOpen, isOpen } = useStoreModal();
   useEffect(() => {
      if (!isOpen) onOpen();
   }, [isOpen, onOpen]);
   return <div className="p-4">Root page</div>;
};

export default HomePage;
