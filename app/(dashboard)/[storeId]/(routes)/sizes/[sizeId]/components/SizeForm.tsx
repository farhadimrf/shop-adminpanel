"use client";

import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import SizesPage from "../../page";

const formSchema = z.object({
   name: z.string().min(1),
   value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

type SizeFormProps = {
   initialData: Size | null;
};

const SizeForm = ({ initialData }: SizeFormProps) => {
   const params = useParams();
   const router = useRouter();

   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const title = initialData ? "Edit size" : "Create size";
   const description = initialData ? "Edit a size" : "Add a new size";
   const toastMessage = initialData ? "Size updated." : "Size created.";
   const action = initialData ? "Save changes" : "Create";

   const form = useForm<SizeFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData || {
         name: "",
         value: "",
      },
   });

   const onSubmit = async (data: SizeFormValues) => {
      try {
         setIsLoading(true);
         if (initialData) {
            await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
         } else {
            await axios.post(`/api/${params.storeId}/sizes`, data);
         }

         router.push(`/${params.storeId}/sizes`);
         router.refresh();
         toast.success(toastMessage);
      } catch (err) {
         toast.error("Something went wrong.");
      } finally {
         setIsLoading(false);
      }
   };

   const onDelete = async () => {
      try {
         setIsLoading(true);
         await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
         router.push(`/${params.storeId}/sizes`);
         router.refresh();
         toast.success("Size deleted");
      } catch (err) {
         toast.error("Make sure you removed all products using this size first.");
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
         <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            {initialData && (
               <Button
                  variant="destructive"
                  disabled={isLoading}
                  size="sm"
                  onClick={() => setOpen(true)}
               >
                  <Trash2 className="h-4 w-4" />
               </Button>
            )}
         </div>
         <Separator />
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
               <div className="grid grid-cols-3 gap-8">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input disabled={isLoading} placeholder="Size name" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="value"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Value</FormLabel>
                           <FormControl>
                              <Input disabled={isLoading} placeholder="Size value" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <Button disabled={isLoading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
      </>
   );
};

export default SizeForm;
