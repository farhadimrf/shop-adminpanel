"use client";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AlertModal from "@/components/modals/alert-modal";
import { BillboardColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

type CellActionProps = {
   data: BillboardColumn;
};

const CellAction = ({ data }: CellActionProps) => {
   const router = useRouter();
   const params = useParams();

   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const onCopy = () => {
      navigator.clipboard.writeText(data.id);
      toast.success("Billboard Id copied to the clipboard.");
   };

   const onDelete = async () => {
      try {
         setIsLoading(true);
         await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
         router.refresh();
         toast.success("Billboard deleted");
      } catch (err) {
         toast.error("Make sure you removed all categories using this billboard first.");
      } finally {
         setIsLoading(false);
         setOpen(false);
      }
   };
   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            isLoading={isLoading}
         />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="h-6 w-6 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="w-4 h-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuLabel>Actions</DropdownMenuLabel>
               <DropdownMenuItem className="cursor-pointer" onClick={onCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Id
               </DropdownMenuItem>
               <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}
               >
                  <Edit className="mr-2 h-4 w-4" />
                  Update
               </DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};

export default CellAction;
