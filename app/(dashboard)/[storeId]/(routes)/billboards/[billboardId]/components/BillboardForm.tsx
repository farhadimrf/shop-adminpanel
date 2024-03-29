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
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
   label: z.string().min(1),
   imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

type BillboardFormProps = {
   initialData: Billboard | null;
};

const BillboardForm = ({ initialData }: BillboardFormProps) => {
   const params = useParams();
   const router = useRouter();

   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const title = initialData ? "Edit billboard" : "Create billboard";
   const description = initialData ? "Edit a billboard" : "Add a new billboard";
   const toastMessage = initialData ? "Billboard updated." : "Billboard created.";
   const action = initialData ? "Save changes" : "Create";

   const form = useForm<BillboardFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData || {
         label: "",
         imageUrl: "",
      },
   });

   const onSubmit = async (data: BillboardFormValues) => {
      try {
         setIsLoading(true);
         if (initialData) {
            await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
         } else {
            await axios.post(`/api/${params.storeId}/billboards`, data);
         }

         router.push(`/${params.storeId}/billboards`);
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
         await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
         router.push(`/${params.storeId}/billboards`);
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
               <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>background image</FormLabel>
                        <FormControl>
                           <ImageUpload
                              value={field.value ? [field.value] : []}
                              disabled={isLoading}
                              onChange={(url) => field.onChange(url)}
                              onRemove={() => field.onChange("")}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className="grid grid-cols-3 gap-8">
                  <FormField
                     control={form.control}
                     name="label"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Label</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={isLoading}
                                 placeholder="Billboard label"
                                 {...field}
                              />
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

export default BillboardForm;
