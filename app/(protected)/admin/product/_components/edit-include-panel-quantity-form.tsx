"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import * as z from "zod";
import { EditPanelQuantitySchema, ProductSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { addProduct } from "@/actions/products";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Team {
  teamId: string;
  domainId: string | null;
  name: string;
}

const EditPanelQuantityForm = ({
  domainId,
  productId,
}: {
  productId: string;
  domainId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof EditPanelQuantitySchema>>({
    resolver: zodResolver(EditPanelQuantitySchema),
    defaultValues: {
      id: "",
      domainId: "",
      maxProduct: 0,
      minProduct: 0,
      price: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof EditPanelQuantitySchema>) => {
    setError("");
    startTransition(() => {
    //   addProduct(values).then((data) => {
    //     if (data?.success) {
    //       toast.success(data.success);
    //       form.reset();
    //     }
    //     if (data?.error) {
    //       setError(data.error);
    //     }
    //   });
    });
  };
  return (
    <div className="flex flex-col lg:flex-row md:justify-between gap-4 md:gap-x-10">
      <div className="md:overflow-auto md:max-h-[90vh] w-full md:w-[50%] p-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-[100]%"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minProduct"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Product</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxProduct"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Product</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="mt-0 w-full">
              Edit Panel Quantity
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditPanelQuantityForm;
