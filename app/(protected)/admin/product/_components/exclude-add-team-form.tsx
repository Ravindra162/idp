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
  ProductSchema,
} from "@/schemas";
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
import { excludeTeamInfo } from "@/actions/admin-product-teams";
import { useRouter } from "next/navigation";

interface Team {
  id: string;
  teamId: string;
  domainId: string;
  name: string;
  products: {
    productId: string;
    name: string;
    Price: number;
    Max: number;
    Min: number;
  }[];
}

const ExcludeAddTeamForm = ({
  productId,
  teams,
  productName,
}: {
  productId: string;
  productName: string;
  teams: Team[];
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof EditTeamQuantitySchema>>({
    resolver: zodResolver(EditTeamQuantitySchema),
    defaultValues: {
      id: productId,
      teamId: "",
      name: productName,
      maxProduct: 1,
      minProduct: 2,
      price: 1,
    },
  });

  const onSubmit = (values: z.infer<typeof EditTeamQuantitySchema>) => {
    setError("");
    startTransition(() => {
      excludeTeamInfo(values).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          form.reset();
          router.push("/admin/product/product-table")
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
              name="teamId"
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
                        <SelectValue placeholder="Select Team" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.teamId} value={team.teamId}>
                          {`${team.name} - ${team.teamId} `}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="mt-0 w-full">
              Exclude Team
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ExcludeAddTeamForm;
