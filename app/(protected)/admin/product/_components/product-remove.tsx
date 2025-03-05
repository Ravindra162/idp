"use client";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/actions/products";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { EditProductFormSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import AdminVisibility from "./admin-visibility-form";

const ProductRemove = ({ id }: { id: string }) => {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof EditProductFormSchema>>({
    resolver: zodResolver(EditProductFormSchema),
    defaultValues: {
      minProduct: 0,
    },
  });

  const handleDelete = (id: string) => {
    deleteProduct({ id }).then((data) => {
      if (data?.success) {
        toast.success(data.success);
      }
      if (data?.error) {
        toast.error(data.error);
      }
    });
  };

  return (
    <div className="flex gap-x-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <DialogClose>
              <Button asChild>
                <Link href={`/admin/product/edit-form/${id}`}>Confirm</Link>
              </Button>
            </DialogClose>
          </div>
          <div className="mt-4">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Section
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Visibility
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Manage Panel
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <AdminVisibility
                      productId={id}
                      text="Panels"
                      field="visibleToAllDomains"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Manage Team
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <AdminVisibility
                      productId={id}
                      text="Teams"
                      field="visibleToAllTeams"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Manage Wallet Types
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <AdminVisibility
                      productId={id}
                      text="Wallet Types"
                      field="visibleToAllWalletTypes"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"destructive"}>Remove</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure??</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button onClick={() => handleDelete(id)}>Confirm</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductRemove;
