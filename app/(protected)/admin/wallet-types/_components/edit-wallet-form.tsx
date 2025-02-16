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

type FormValues = z.infer<typeof AddWalletTypeSchema>;

interface PaymentTypeProps {
  type: string;
}

type EditWalletTypeProps = {
  intialVals : WalletTypeProps | null;
  domains: Domain[];
  paymentTypes: PaymentTypeProps[];
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
  domainId: string[];
  paymentType: PaymentType[];
  cstpaymentId: string[];
  createdAt: Date;
  updatedAt: Date;
};

const WalletForm = ({
  intialVals,
  domains,
  paymentTypes,
}: EditWalletTypeProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

    const form = useForm<FormValues>({
      resolver: zodResolver(AddWalletTypeSchema),
      mode: "onBlur",
      defaultValues: {
        name: intialVals?.name ?? "",
        paymentType: intialVals?.paymentType?.map((pt) => ({ type: pt })) ?? [],
        domainId: intialVals?.domainId?.map((id) => ({ type: id })) ?? [],
        description: intialVals?.description ?? "",
        currencyCode: intialVals?.currencyCode ?? "",
        cstpaymentId: intialVals?.cstpaymentId ?? [],
      },
    });

  const {
    fields: paymentTypeFields,
    append: appendPaymentType,
    remove: removePaymentType,
  } = useFieldArray({
    name: "paymentType",
    control: form.control,
  });

  const {
    fields: domainIdFields,
    append: appendDomainId,
    remove: removeDomainId,
  } = useFieldArray({
    name: "domainId",
    control: form.control,
  });

  const onSubmit = (values: FormValues) => {
    setError("");
  
    if (values.paymentType.length === 0) {
      toast.error("Payment type cannot be empty");
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
                    <Input type="text"
                     placeholder="Enter Wallet Type Name"
                    disabled={isPending} 
                    {...field} />
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
                    <Input type="text"
                    placeholder="Enter Description"
                     disabled={isPending} {...field} />
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
                    <Input type="text"
                    placeholder="Enter Currency Code"
                     disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Type Fields */}
            <div className="mt-4">
            <FormLabel>Payment Type</FormLabel>
            </div>
            {paymentTypeFields.map((item, index) => (
              <div key={item.id}>
                <FormField
                  control={form.control}
                  name={`paymentType.${index}.type`}
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
                          {paymentTypes.map((paymentType: any) => (
                            <SelectItem
                              value={paymentType.type}
                              key={paymentType.id}
                              className="capitalize"
                            >
                              {paymentType.type}
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
                  onClick={() => removePaymentType(index)}
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
                name="paymentType"
                render={() => (
                  <Button type="button" disabled={isPending} className={`mb-2`}>
                    <div className="flex items-center gap-x-3 mt-2 mb-2">
                      <label
                        htmlFor="PaymentType"
                        className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline`}
                        tabIndex={0}
                        onClick={() => {
                          if (paymentTypeFields.length === 0) {
                            appendPaymentType({
                              type: "",
                            });
                          } else {
                            const lastPaymentType =
                              form.getValues().paymentType[
                                paymentTypeFields.length - 1
                              ];

                            if (
                              lastPaymentType &&
                              lastPaymentType.type.trim() !== ""
                            ) {
                              appendPaymentType({
                                type: "",
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
                  name={`domainId.${index}.type`}
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
                name="domainId"
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
                              form.getValues().domainId[
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
