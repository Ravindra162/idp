"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { EditTeamSchema, UpdateTeamAmountLimitSchema } from "@/schemas";
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
import { editTeam } from "@/actions/admin-teams";
import { editAmountLimitTeam } from "@/actions/admin-member-team";

type FormValues = z.infer<typeof UpdateTeamAmountLimitSchema>;

type Team = {
  id: string;
  amountLimit: number;
} | null;

type TeamEditFormProps = {
  teamId: string;
  domainId : string;
  team: Team;
};

const AddTeamMemberForm = ({ teamId, domainId, team }: TeamEditFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(UpdateTeamAmountLimitSchema),
    defaultValues: {
      teamId: teamId,
      amountLimit: team?.amountLimit,
    },
  });

  const onSubmit = (values: FormValues) => {
    setError("");

    startTransition(() => {
      editAmountLimitTeam(values).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          form.reset();
          router.push(`/admin/team/table/${domainId}`);
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
          name="amountLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Amount Limit</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Amount Limit"
                  {...field}
                  disabled={isPending}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit" className="w-full">
          Update Amount Limit
        </Button>
      </form>
    </Form>
  );
};

export default AddTeamMemberForm;
