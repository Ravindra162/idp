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
import { removeMember } from "@/actions/admin-member-team";
import ProUser from "../../_components/upgrade-to-pro";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";

const TeamUserRemove = ({
  teamId,
  userId,
  userRole,
}: {
  teamId: string;
  userId: string;
  userRole: UserRole;
}) => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof EditProductFormSchema>>({
    resolver: zodResolver(EditProductFormSchema),
    defaultValues: {
      minProduct: 0,
    },
  });

  const handleDelete = async (teamId: string, userId: string) => {
    try {
      const response = await removeMember(teamId ?? "", userId);
      if (response.success) {
        toast.success("Member removed successfully!");
        router.refresh();
      } else {
        toast.error("Failed to remove member.");
      }
    } catch (error: any) {
      console.error("Error removing member:", error);
      toast.error("Error removing member.");
    }
  };

  return (
    <div className="flex gap-x-3">
      <ProUser userId={userId} role={userRole} />
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
              <Button onClick={() => handleDelete(teamId, userId)}>
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamUserRemove;
