"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFieldArray, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDomains } from "@/actions/admin-domains";
import { PaymentType } from "@prisma/client";
import { z } from "zod";
import { AddWalletTypeSchema, UpdateWalletTypeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { addWalletType, updateWalletType } from "@/actions/add-wallet-type";
import { init } from "next/dist/compiled/webpack/webpack";
import { PaymentMethodDetails } from "./wallet-form";

type FormValues = z.infer<typeof UpdateWalletTypeSchema>;

interface PaymentTypeProps {
  type: string;
}

type EditWalletTypeProps = {
  intialVals: WalletTypeProps | null;
  domains: Domain[];
  paymentTypes: PaymentTypeProps[];
  paymentTypeMethodDetails: PaymentMethodDetails[];
};

type Domain = {
  id: string;
  name: string;
  base_url: string;
  createdAt: Date;
  settingsId: string;
};

export type WalletTypeProps = {
  id: string;
  name: string;
  currencyCode: string;
  description: string;
  domainIds: any;
  payments: any;
};

const WalletForm = ({
  intialVals,
  domains,
  paymentTypes,
  paymentTypeMethodDetails,
}: EditWalletTypeProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(UpdateWalletTypeSchema),
    defaultValues: {
      id : "",
      name: intialVals?.name,
      currencyCode: intialVals?.currencyCode,
      description: intialVals?.description,
    },
  });

  const onSubmit = (values: FormValues) => {
    setError("");

    console.log("Form values:", values);

    startTransition(() => {
      updateWalletType(values)
        .then((data) => {
          if (data?.success) {
            toast.success("Wallet Type added successfully");
            form.reset();
            router.push("/admin/wallet-types/table");
          }

          if (data?.error) {
            setError(data.error);
            toast.error(data.error, {
              action: {
                label: "Close",
                onClick: () => console.log("Undo"),
              },
            });
          }
        })
        .catch((error) => {
          console.error("Error adding wallet type:", error);
          toast.error("An error occurred while adding the wallet type.");
        });
    });
  };

  return (
    <div className="flex flex-col lg:flex-row md:justify-between gap-4 md:gap-x-10">
      <div className="md:overflow-auto md:max-h-[90vh] w-full md:w-[50%] p-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-[100%]"
          >
            {/* Wallet Type Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Type Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Wallet Type Name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Description"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency Code Field */}
            <FormField
              control={form.control}
              name="currencyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Currency Code"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit" className="mt-0 w-full">
              Add Wallet
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default WalletForm;
