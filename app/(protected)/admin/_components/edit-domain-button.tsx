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
import Link from "next/link";

const EditDomainButton = ({ id }: { id: string }) => {
  return (
    <div className="flex gap-x-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Domain</DialogTitle>
            <DialogDescription>Modify the domain details.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button asChild>
                <Link href={`/admin/panels/edit/${id}`}>Confirm</Link>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDomainButton;
