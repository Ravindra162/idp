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
import {
  EditPanelQuantitySchema,
  EditTeamQuantitySchema,
  EditWalletTypeQuantitySchema,
  ProductSchema,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { addProduct } from "@/actions/products";
import { toast } from "sonner";
import { includeWalletTypeInfo } from "@/actions/admin-product-walletTypes";
import { useRouter } from "next/navigation";

const EditWalletTypeQuantityForm = ({
  walletTypeId,
  productId,
  productName,
  minProduct,
  maxProduct,
  price,
}: {
  walletTypeId: string;
  productId: string;
  productName: string;
  minProduct: number;
  maxProduct: number;
  price: number;
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();
  const form = useForm<z.infer<typeof EditWalletTypeQuantitySchema>>({
    resolver: zodResolver(EditWalletTypeQuantitySchema),
    defaultValues: {
      id: productId,
      name: productName,
      walletTypeId: walletTypeId,
      minProduct: minProduct,
      maxProduct: maxProduct,
      price: price,
    },
  });

  const onSubmit = (values: z.infer<typeof EditWalletTypeQuantitySchema>) => {
    setError("");
    startTransition(() => {
      includeWalletTypeInfo(values).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          form.reset();
          router.push("/admin/product/product-table");
        }
        if (data?.error) {
          setError(data.error);
        }
      });
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
              Edit Team Quantity
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditWalletTypeQuantityForm;
