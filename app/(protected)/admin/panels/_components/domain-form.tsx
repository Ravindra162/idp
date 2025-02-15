"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { AddDomainSchema, UpdateDomainSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { toast } from "sonner";
import { addDomain, updateDomain } from "@/actions/admin-domains";

type DomainProps = {
  id: string;
  name?: string;
  description?: string;
  base_url?: string;
  settingsId?: string;
};

const DomainForm = ({
  userId,
  domain,
  isEdit,
}: {
  userId: string;
  domain?: DomainProps; // Required for edit mode
  isEdit: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  // Dynamically select schema based on isEdit
  const schema = isEdit ? UpdateDomainSchema : AddDomainSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? {
          id: domain?.id || "",
          name: domain?.name || "",
          base_url: domain?.base_url || "",
          description: domain?.description || "",
          settingsId: domain?.settingsId || "",
        }
      : {
          name: "",
          base_url: "",
          description: "",
          userId: userId,
        },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    setError("");
    startTransition(() => {
      if (isEdit && domain) {
        const updateValues: z.infer<typeof UpdateDomainSchema> = { id: domain.id, ...values };
        updateDomain(updateValues).then((data) => {
          if (data?.success) {
            toast.success(data.success);
          }
          if (data?.error) {
            setError(data.error);
          }
        });
      } else {
        const addValues: z.infer<typeof AddDomainSchema> = values as z.infer<typeof AddDomainSchema>;
        addDomain(addValues).then((data) => {
          if (data?.success) {
            toast.success(data.success);
            form.reset();
          }
          if (data?.error) {
            setError(data.error);
          }
        });
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full md:w-[50%]"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Panel Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Panel Name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Panel Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Panel Description"
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
                  <FormLabel>Panel Base URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="text"
                      placeholder="Panel Base URL"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <Button type="submit" disabled={isPending} className="w-full">
            {isEdit ? "Update Panel" : "Add Panel"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default DomainForm;
