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
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDomains } from "@/actions/admin-domains";
import { PaymentType } from "@prisma/client";


type Domain = {
    id : string;
    name : string;
    base_url : string;
    createdAt : Date;
    settingsId : string;
}

const EditWalletForm = () => {
    const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
    const [domains, setDomains] = useState<Domain[]>([]);
    const router = useRouter();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const paymentTypesResponse = [PaymentType.MANUAL, PaymentType.PAYMENT_GATEWAY, PaymentType.CUSTOM_METHOD];
          setPaymentTypes(paymentTypesResponse || []);
  
          const domainsResponse = await getDomains();
          setDomains(domainsResponse.data || []);
  
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);

  const form = useForm({
    defaultValues: {
      walletName: "",
      paymentType: "",
      domainName: "",
      description: "",
      currency: "",
    },
  });

  const onSubmit = async (values: any) => {
    console.log("Form Values", values);
    toast.success("Wallet added successfully!");
    form.reset();
    router.refresh();
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full md:w-[50%]">
          {/* Wallet Name */}
          <FormField
            control={form.control}
            name="walletName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter wallet name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Type Selection */}
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Domain Name Selection */}
          <FormField
            control={form.control}
            name="domainName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain.id} value={domain.id}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Wallet Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter wallet description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Wallet currency Symbol */}
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency Symbol</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter currency Symbol" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Create Wallet
          </Button>
        </form>
      </Form>
  );
};

export default EditWalletForm;
