import { useStoreModal } from "@/hooks/use-stroe-modal";
import Modal from "@/components/ui/modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

const schema = z.object({
   name: z.string().min(3, { message: "Store name must be at least 3 word" }),
});

type schemaType = z.infer<typeof schema>;

const StoreModal = () => {
   const [isLoading, setIsLoading] = useState(false);
   const { isOpen, onClose } = useStoreModal();

   const form = useForm<schemaType>({
      resolver: zodResolver(schema),
   });

   const onSubmit = async (data: schemaType) => {
      try {
         setIsLoading(true);
         const response = await axios.post("/api/stores", data);
         toast.success("Store created.");
      } catch (error) {
         toast.error("Something went wrong.");
      } finally {
         setIsLoading(false);
      }
   };
   return (
      <Modal
         title="Create store"
         description="Add a new store to manage products and categories"
         isOpen={isOpen}
         onClose={onClose}
      >
         <div>
            <div className="space-y-4 py-2 pb-4">
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input disabled={isLoading} placeholder="E-Commerce" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                        <Button disabled={isLoading} variant="outline" onClick={onClose}>
                           Cancel
                        </Button>
                        <Button disabled={isLoading} type="submit">
                           Continue
                        </Button>
                     </div>
                  </form>
               </Form>
            </div>
         </div>
      </Modal>
   );
};

export default StoreModal;
