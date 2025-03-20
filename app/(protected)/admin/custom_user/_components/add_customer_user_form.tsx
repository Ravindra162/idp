"use client";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { CustomUserCreateSchema, TeamCreateSchema } from "@/schemas";
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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { addCustomUser } from "@/actions/admin-custom-user";

type FormValues = z.infer<typeof CustomUserCreateSchema>;

type CustomerUserCreationFormProps = {
  users: Array<{ id: string; name: string }>;
  modulesList: Array<{ name: String }>;
  accessTypesList: Array<{ name: String}>;
};

const CustomerUserCreationForm = ({
  users,
  modulesList,
  accessTypesList
}: CustomerUserCreationFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  

  const form = useForm<FormValues>({
    resolver: zodResolver(CustomUserCreateSchema),
    defaultValues: {
      userId: "",
      modules: [
        {
          name: "",
          accessType: "",
        },
      ],
    },
  });

  const onSubmit = (values: FormValues) => {
    setError("");

    startTransition(() => {
      addCustomUser(values).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          form.reset();
          router.push(`/admin/custom_user/table`);
        }
        if (data?.error) {
          setError(data.error);
          toast.error(data.error);
        }
      });
    });
  };

  const { fields, append, remove } = useFieldArray({
    name: "modules",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full md:w-[50%]"
      >
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => {
            const filteredUsers = users.filter((user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
              <FormItem>
                <FormLabel>User</FormLabel>
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

        {fields.map((item, index) => (
          <div key={item.id}>
            <FormField
              control={form.control}
              name={`modules.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module Name</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedModule = modulesList.find(
                        (p: any) => p.name === value
                      );
                      if (selectedModule) {
                      }
                    }}
                    disabled={isPending}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Module" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {modulesList.map((product: any) => (
                        <SelectItem
                          value={product.name}
                          key={product.id}
                          className="capitalize"
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`modules.${index}.accessType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedAccessType = accessTypesList.find(
                        (p: any) => p.name === value
                      );
                      if (selectedAccessType) {
                      }
                    }}
                    disabled={isPending}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Access Types" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {accessTypesList.map((product: any) => (
                        <SelectItem
                          value={product.name}
                          key={product.id}
                          className="capitalize"
                        >
                          {product.name}
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
              onClick={() => remove(index)}
              className="mt-2 mb-2"
              variant={"ghost"}
            >
              Remove Module
            </Button>
          </div>
        ))}

        {/* Add Product Button */}
        <div>
          <FormField
            control={form.control}
            name="modules"
            render={() => (
              <Button type="button" disabled={isPending} className={`mb-2`}>
                <div className="flex items-center gap-x-3 mt-2 mb-2">
                  <label
                    htmlFor="Products"
                    className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline`}
                    tabIndex={0}
                    onClick={() => {
                      if (fields.length === 0) {
                        append({
                          name: "",
                          accessType: "",
                        });
                      } else {
                        const lastModule =
                          form.getValues().modules[fields.length - 1];

                        if (lastModule && lastModule.name.trim() !== "") {
                          append({
                            name: "",
                            accessType: "",
                          });
                        } else {
                          toast.error(
                            "Please fill in the previous product before adding a new one."
                          );
                        }
                      }
                    }}
                  >
                    Add Module
                  </label>
                </div>
              </Button>
            )}
          />
        </div>

        <Button disabled={isPending} type="submit" className="w-full">
          Create Custom User
        </Button>
      </form>
    </Form>
  );
};

export default CustomerUserCreationForm;
