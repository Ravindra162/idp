"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import PaymentMethodsRemove from "./included-payment-method-remove";

export interface Paymenttype {
  name: string;
  id: string;
  paymentType: string;
}

interface WalletPaymentTypesDialogProps {
  walletTypeId: string;
  paymentTypes: Paymenttype[];
}

const WalletPaymentTypesDialog = ({
  paymentTypes,
  walletTypeId,
}: WalletPaymentTypesDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Payment Types
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader></DialogHeader>

        {/* Included Teams List in Table Format */}
        <Button className="text-sm w-auto ml-auto" asChild>
          <Link href={`/admin/product/team-quantity/`} className="inline">
            Include a Payment Method
          </Link>
        </Button>
        <DialogTitle>Payment Types</DialogTitle>
        <ScrollArea className="max-h-[300px] mt-4 border rounded-md p-4">
          {paymentTypes.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No Payment Methods
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Payment Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentTypes.map((paymentType) => (
                  <TableRow key={paymentType.id}>
                    <TableCell>{paymentType.paymentType}</TableCell>
                    <TableCell>{paymentType.name}</TableCell>
                    <TableCell>
                      <PaymentMethodsRemove walletTypeId={walletTypeId} paymentMethodId={paymentType.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default WalletPaymentTypesDialog;
