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
import { excludePanelInfo } from "@/actions/admin-product-panels";
import { useRouter } from "next/navigation";

interface Panel {
  id: string;
  name: string;
  products: {
    productId: string;
    name: string;
    Price: number;
    Max: number;
    Min: number;
  }[];
}

const ExcludeAddPanelForm = ({
  productId,
  panels,
  name
}: {
  productId: string;
  name: string;
  panels: Panel[];
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof EditPanelQuantitySchema>>({
    resolver: zodResolver(EditPanelQuantitySchema),
    defaultValues: {
      id: productId,
      domainId: "",
      name: name,
      maxProduct: 1,
      minProduct: 2,
      price: 1,
    },
  });

  const onSubmit = (values: z.infer<typeof EditPanelQuantitySchema>) => {
    setError("");
    startTransition(() => {
      console.log(values.domainId)
      excludePanelInfo(values).then((data) => {
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
              name="domainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    disabled={isPending}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Panel" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {panels.map((panel) => (
                        <SelectItem key={panel.id} value={panel.id}>
                          {`${panel.name} - ${panel.id} `}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="mt-0 w-full">
              Exclude Panel
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ExcludeAddPanelForm;
