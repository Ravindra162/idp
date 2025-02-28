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
  WalletPaymentSchema,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { addProduct } from "@/actions/products";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { PaymentMethodDetails, PaymentTypeProps } from "../../../_components/wallet-form";


const AddIncludePaymentMethodsForm = ({
    walletTypeId, paymentTypes, paymentTypeMethodDetails
}: {
  walletTypeId : string;
  paymentTypes : PaymentTypeProps[];
  paymentTypeMethodDetails : PaymentMethodDetails[];
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof WalletPaymentSchema>>({
    resolver: zodResolver(WalletPaymentSchema),
    defaultValues: {
      type : "",
      details : []
    },
  });

  const onSubmit = (values: z.infer<typeof WalletPaymentSchema>) => {
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
                  name={`type`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        disabled={isPending}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment type" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {paymentTypes.map((paymentType) => (
                            <SelectItem
                              key={paymentType.type}
                              value={paymentType.type}
                            >
                              {paymentType.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name={`details`}
                    render={({ field }) => (
                      <FormItem>
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
                            {paymentTypeMethodDetails.map(
                              (paymentMethodDetail) => (
                                <SelectItem
                                  key={paymentMethodDetail.id}
                                  value={paymentMethodDetail.name || ""}
                                >
                                  {paymentMethodDetail.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  </div>
            <Button type="submit" disabled={isPending} className="mt-0 w-full">
              Edit Team Payment Method
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddIncludePaymentMethodsForm;
