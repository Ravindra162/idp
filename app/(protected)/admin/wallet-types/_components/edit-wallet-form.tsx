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
import { AddWalletTypeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { addWalletType, updateWalletType } from "@/actions/add-wallet-type";
import { init } from "next/dist/compiled/webpack/webpack";
import { PaymentMethodDetails } from "./wallet-form";

type FormValues = z.infer<typeof AddWalletTypeSchema>;

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
    resolver: zodResolver(AddWalletTypeSchema),
    defaultValues: {
      name: intialVals?.name,
      currencyCode: intialVals?.currencyCode,
      description: intialVals?.description,
      payments: [
        {
          type: "",
          details: [],
        },
      ],
      domainIds: [
        {
          type: "",
        },
      ],
    },
  });

  console.log(intialVals?.payments);

  const {
    fields: domainIdFields,
    append: appendDomainId,
    remove: removeDomainId,
  } = useFieldArray({
    name: "domainIds",
    control: form.control,
  });

  // For payments field
  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    name: "payments",
    control: form.control,
  });

  const onSubmit = (values: FormValues) => {
    setError("");

    if (values.payments.length === 0) {
      toast.error("Payment type cannot be empty");
      return;
    }

    if (values.domainIds.length == 0) {
      toast.error("DomainIds cannot be empty");
      return;
    }

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

            {/* Payment Type Fields */}
            <div className="mt-4">
              <FormLabel>Payment Methods</FormLabel>
            </div>
            {paymentFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  control={form.control}
                  name={`payments.${index}.type`}
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
                    name={`payments.${index}.details`}
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
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={() => removePayment(index)}
                  className="mt-2 mb-2"
                  variant={"ghost"}
                >
                  Remove Payment Type
                </Button>
              </div>
            ))}

            {/* Add Payment Type Button */}
            <div>
              <FormField
                control={form.control}
                name="payments"
                render={() => (
                  <Button type="button" disabled={isPending} className={`mb-2`}>
                    <div className="flex items-center gap-x-3 mt-2 mb-2">
                      <label
                        htmlFor="PaymentType"
                        className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline`}
                        tabIndex={0}
                        onClick={() => {
                          if (paymentFields.length === 0) {
                            appendPayment({
                              type: "",
                              details: [],
                            });
                          } else {
                            const lastPaymentType =
                              form.getValues().payments[
                                paymentFields.length - 1
                              ];

                            if (
                              lastPaymentType &&
                              lastPaymentType.type.trim() !== ""
                            ) {
                              appendPayment({
                                type: "",
                                details: [],
                              });
                            } else {
                              toast.error(
                                "Please fill in the previous payment type before adding a new one."
                              );
                            }
                          }
                        }}
                      >
                        Add Payment Type
                      </label>
                    </div>
                  </Button>
                )}
              />
            </div>

            {/* Domain ID Fields */}
            <div className="mt-4">
              <FormLabel>Panel</FormLabel>
            </div>
            {domainIdFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  control={form.control}
                  name={`domainIds.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        disabled={isPending}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Panel" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {domains.map((domain: any) => (
                            <SelectItem
                              value={domain.name}
                              key={domain.id}
                              className="capitalize"
                            >
                              {domain.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={() => removeDomainId(index)}
                  className="mt-2 mb-2"
                  variant={"ghost"}
                >
                  Remove Panel
                </Button>
              </div>
            ))}

            {/* Add Domain Button */}
            <div>
              <FormField
                control={form.control}
                name="domainIds"
                render={() => (
                  <Button type="button" disabled={isPending} className={`mb-2`}>
                    <div className="flex items-center gap-x-3 mt-2 mb-2">
                      <label
                        htmlFor="DomainId"
                        className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline`}
                        tabIndex={0}
                        onClick={() => {
                          if (domainIdFields.length === 0) {
                            appendDomainId({
                              type: "",
                            });
                          } else {
                            const lastDomainId =
                              form.getValues().domainIds[
                                domainIdFields.length - 1
                              ];

                            if (
                              lastDomainId &&
                              lastDomainId.type.trim() !== ""
                            ) {
                              appendDomainId({
                                type: "", // Default value
                              });
                            } else {
                              toast.error(
                                "Please fill in the previous panel before adding a new one."
                              );
                            }
                          }
                        }}
                      >
                        Add Panel
                      </label>
                    </div>
                  </Button>
                )}
              />
            </div>

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
