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
import { removeExcludeWalletTypeInfo, removeIncludeWalletTypeInfo } from "@/actions/admin-product-walletTypes";

const IncludedWalletRemove = ({ id , walletId }: { id: string; walletId : string; }) => {
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = (productId: string, walletTypeId: string) => {
    removeIncludeWalletTypeInfo(walletTypeId, productId).then((data) => {
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button asChild>
                <Link href={`/admin/product/wallet-quantity/${id}/edit/${walletId}`}>Confirm</Link>
              </Button>
            </DialogClose>
          </DialogFooter>
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
              <Button onClick={() => handleDelete(id, walletId)}>Confirm</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncludedWalletRemove;
