"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/shared/form-error";
import { login } from "@/actions/login";
import CardWrapper from "./card-wrapper";

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
      {...field}
      disabled={disabled}
      placeholder={placeholder}
      type={showPassword ? "text" : "password"}
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

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login({ ...values, domainId: process.env.DOMAIN_ID }).then((data) => {
        setError(data?.error);
      });
    });
  };
  

  return (
    <CardWrapper
      headerLabel="Welcome back!!"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/signup"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Email/whatsapp-number"
                      type="text"
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
          </div>
          <FormError message={error} />
          <Button type="submit" disabled={isPending} className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};