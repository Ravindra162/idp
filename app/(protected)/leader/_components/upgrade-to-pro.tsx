"use client";
import React, { useTransition, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProUserSchema } from "@/schemas";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/shared/form-error";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import DowngradeToUser from "./downgrade-to-pro";
import { addProUser } from "@/actions/user-pro";

type ProUserProps = {
  userId: string;
  role:"PRO" | "BLOCKED" | "USER" | "ADMIN" | "LEADER" | "CUSTOM_ROLE";
};

const ProUser = ({ userId, role }: ProUserProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ProUserSchema>>({
    resolver: zodResolver(ProUserSchema),
    defaultValues: {
      userId: userId,
      amount: 0,
      products: [
        {
          name: "",
          minProduct: 0,
          maxProduct: 1,
          price: 0,
        },
      ],
    },
  });

  const onSubmit = (values: z.infer<typeof ProUserSchema>) => {
    startTransition(() => {
      addProUser(values).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
          form.reset();
        }
      });
    });
  };

  return (
    <>
      {role === "PRO" ? (
        <DowngradeToUser userId={userId} />
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"default"}>Upgrade to pro</Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
            <SheetTitle>
              <p className="text-2xl font-bold">Upgrade to pro</p>
            </SheetTitle>
            <Separator className="border border-gray-500" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter the amount limit</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter the amount limit"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormError message={error} />
                <SheetFooter>
                  {form.formState.errors || error ? (
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full"
                    >
                      Upgrade to pro
                    </Button>
                  ) : (
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          type="submit"
                          disabled={isPending}
                          className="w-full"
                        >
                          Upgrade to pro
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  )}
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default ProUser;
