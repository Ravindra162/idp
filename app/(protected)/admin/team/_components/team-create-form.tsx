"use client";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { TeamCreateSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { addBankDetails } from "@/actions/add-bank-details";
import { toast } from "sonner";
import { FormError } from "@/components/shared/form-error";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { createTeam } from "@/actions/admin-teams";

type FormValues = z.infer<typeof TeamCreateSchema>;

type TeamCreationFormProps = {
  users: Array<{ id: string; name: string }>;
  userId: string;
  domainId: string;
};

const TeamCreationForm = ({
  userId,
  users,
  domainId,
}: TeamCreationFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(TeamCreateSchema),
    defaultValues: {
      teamName: "",
      teamLeader: "",
      teamDescription: "",
      domainId : domainId
    },
  });

  const onSubmit = (values: FormValues) => {
    setError("");

    startTransition(() => {
        createTeam(values).then((data) => {
          if (data?.success) {
            toast.success(data.success);
            form.reset();
            router.refresh();
          }
          if (data?.error) {
            setError(data.error);
            toast.error(data.error);
          }
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full md:w-[50%]"
      >
        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter team name"
                  {...field}
                  disabled={isPending}
                  type="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teamLeader"
          render={({ field }) => {
            const filteredUsers = users.filter((user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
              <FormItem>
                <FormLabel>Team Leader</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    disabled={isPending}
                    value={field.value} 
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Search Input */}
                      <div className="p-2">
                        <Input
                          type="text"
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      {/* Filtered List */}
                      {filteredUsers.map((user) => (
                        <SelectItem value={user.id} key={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="teamDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter team description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit" className="w-full">
          Create Team
        </Button>
      </form>
    </Form>
  );
};

export default TeamCreationForm;
