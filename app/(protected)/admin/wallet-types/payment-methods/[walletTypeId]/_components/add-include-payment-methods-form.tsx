"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  WalletPaymentSchema,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { addProduct } from "@/actions/products";
import { toast } from "sonner";
import {
  PaymentMethodDetails,
  PaymentTypeProps,
} from "../../../_components/wallet-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPaymentMethod } from "@/actions/add-wallet-type";
import { useRouter } from "next/navigation";

const AddIncludePaymentMethodsForm = ({
  walletTypeId,
  paymentTypes,
  paymentTypeMethodDetails,
}: {
  walletTypeId: string;
  paymentTypes: PaymentTypeProps[];
  paymentTypeMethodDetails: PaymentMethodDetails[];
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof WalletPaymentSchema>>({
    resolver: zodResolver(WalletPaymentSchema),
    defaultValues: {
      type: "",
      details: [],
    },
  });

  const onSubmit = (values: z.infer<typeof WalletPaymentSchema>) => {
    setError("");
    startTransition(() => {
      addPaymentMethod(values, walletTypeId).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          form.reset();
          router.push("/admin/wallet-types/table");
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Types </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    disabled={isPending}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment Type" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {paymentTypes.map((type) => (
                        <SelectItem key={type.type} value={type.type}>
                          {`${type.type} `}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`details`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Details</FormLabel>

                  <Select
                    onValueChange={(value) => {
                      const updatedDetails = [
                        ...field.value,
                        paymentTypeMethodDetails.find(
                          (method) => method.name === value
                        ),
                      ];
                      field.onChange(updatedDetails);
                    }}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a method details" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {paymentTypeMethodDetails.map((paymentMethodDetail) => (
                        <SelectItem
                          key={paymentMethodDetail.id}
                          value={paymentMethodDetail.name || ""}
                        >
                          {paymentMethodDetail.name} - {paymentMethodDetail.bankName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="mt-0 w-full">
              Include Payment Method
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddIncludePaymentMethodsForm;
