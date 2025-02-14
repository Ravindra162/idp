"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import * as z from "zod";
import { AddDomainSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { toast } from "sonner";
import { addDomain } from "@/actions/admin-domains";

const DomainForm = ({ userId }: { userId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof AddDomainSchema>>({
    resolver: zodResolver(AddDomainSchema),
    defaultValues: {
      name: "",
      base_url: "",
      userId: userId
    },
  });

  const onSubmit = (values: z.infer<typeof AddDomainSchema>) => {
    setError("");
    startTransition(() => {
      addDomain(values).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          form.reset();
        }
        if (data?.error) {
          setError(data.error);
        }
      });
    });
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full md:w-[50%]"
        >
          <div className="space-y-4 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Domain Name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="base_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain Base URL</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="text" placeholder="Domain Base URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <Button type="submit" disabled={isPending} className="w-full">
            Add Domain
          </Button>
        </form>
      </Form>
    </>
  );
};

export default DomainForm;
