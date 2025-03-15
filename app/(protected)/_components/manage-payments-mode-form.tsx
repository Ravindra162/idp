"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { ManagePaymentModeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormError } from "@/components/shared/form-error";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  modifyPaymentMode,
  refreshMerchantToken,
} from "@/actions/admin-manage-payment-mode";

const ManagePaymentModeForm = ({ userId }: { userId: string }) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const form = useForm<z.infer<typeof ManagePaymentModeSchema>>({
    resolver: zodResolver(ManagePaymentModeSchema),
    defaultValues: {
      paymentType: "",
      userId: userId,
    },
  });

  function onSubmit(values: z.infer<typeof ManagePaymentModeSchema>) {
    setError("");
    startTransition(() => {
      modifyPaymentMode(values).then((data) => {
        console.log(values.userId);
        if (data.error) {
          setError(data.error);
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    });
  }

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const result = await refreshMerchantToken();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "Token refreshed successfully.");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"link"}>Refresh Token</Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
        <SheetTitle>
          <p className="text-2xl font-bold">Refresh Token</p>
        </SheetTitle>
        <Separator className="border border-gray-500" />
        <Button
          disabled={isRefreshing}
          onClick={handleRefreshToken}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {isRefreshing ? "Refreshing..." : "Refresh Token"}
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default ManagePaymentModeForm;
