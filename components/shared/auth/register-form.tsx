"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { FormError } from "@/components/shared/form-error";
import CardWrapper from "./card-wrapper";
import { FormSuccess } from "@/components/shared/form-success";
import { register } from "@/actions/register";
import { useRouter } from "next/navigation";
import TermsAndConditionsDialog from "./terms_conditions";
import PrivacyPolicyDialog from "./privacy_policy";
import ReferralCodeDialog from "./referral-code-dialog";

const PasswordInput = ({
  field, 
  disabled, 
  placeholder, 
  showPassword, 
  togglePasswordVisibility
}: {
  field: any, 
  disabled: boolean, 
  placeholder: string, 
  showPassword: boolean, 
  togglePasswordVisibility: () => void
}) => (
  <div className="relative">
    <Input
      placeholder={placeholder}
      autoComplete="off"
      disabled={disabled}
      type={showPassword ? "text" : "password"}
      {...field}
    />
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
);

const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const router = useRouter();
  const [formValues, setFormValues] = useState<z.infer<typeof RegisterSchema> | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      number: "",
      confirmPassword: "",
      domainId: "",
      referralCode: "",
    },
  });

  useEffect(() => {
    const domain = window.location.origin;
    form.setValue("domainId", domain);

    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get("referralcode");
    
    if (referralCode) {
      form.setValue("referralCode", referralCode);
    }
  }, [form]);

  const handleContinueWithoutReferral = () => {
    setShowReferralDialog(false);
    if (formValues) {
      submitForm(formValues);
    }
  };

  const submitForm = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values).then((data) => {
        setError(data?.error);
        if (data?.success) {
          setSuccess("Successfully registered! Redirecting to login...");
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        }
      });
    });
  };

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    if (values.referralCode) {
      submitForm(values);
      return;
    }

    setFormValues(values);
    setShowReferralDialog(true);
  }

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      autoComplete="off"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      autoComplete="off"
                      disabled={isPending}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Whatsapp Number"
                      autoComplete="off"
                      disabled={isPending}
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      disabled={isPending}
                      placeholder="Password"
                      showPassword={showPassword}
                      togglePasswordVisibility={() => setShowPassword(!showPassword)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      disabled={isPending}
                      placeholder="Confirm Password"
                      showPassword={showConfirmPassword}
                      togglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referralCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Referral Code"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Create an account
          </Button>
        </form>
      </Form>
      <ReferralCodeDialog
        isOpen={showReferralDialog}
        onClose={() => setShowReferralDialog(false)}
        onContinue={handleContinueWithoutReferral}
      />
    </CardWrapper>
  );
};

export default RegisterForm;