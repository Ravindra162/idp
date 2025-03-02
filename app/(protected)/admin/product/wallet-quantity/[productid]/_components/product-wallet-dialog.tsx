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
import IncludedWalletRemove from "./included-wallet-remove";
import ExcludedWalletRemove from "./excluded-wallet-remove";
import Link from "next/link";

interface Wallet {
  id: string;
  name: string;
  products: {
    productId: string;
    name: string;
    Price: number;
    Max: number;
    Min: number;
  }[];
}

interface ProductWalletsDialogProps {
  wallets: Wallet[];
  includedWallets: Wallet[];
  excludedWallets: Wallet[];
  productName: string;
  productId: string;
}

const ProductWalletsDialog = ({
  wallets,
  includedWallets,
  excludedWallets,
  productName,
  productId,
}: ProductWalletsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Wallet Types
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader></DialogHeader>

        {/* Included Wallets List in Table Format */}
        <Button className="text-sm w-auto ml-auto" asChild>
          <Link
            href={`/admin/product/wallet-quantity/${productId}/add`}
            className="inline"
          >
            Include a Wallet Type
          </Link>
        </Button>
        <DialogTitle>
          Wallet having special access{" "}
          {productName.charAt(0).toUpperCase() + productName.slice(1)}
        </DialogTitle>
        <ScrollArea className="max-h-[300px] mt-4 border rounded-md p-4">
          {includedWallets.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No wallets are using this product
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet ID</TableHead>
                  <TableHead>Wallet Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Min</TableHead>
                  <TableHead>Max</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {includedWallets.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell>{wallet.id}</TableCell>
                    <TableCell>{wallet.name}</TableCell>
                    <TableCell>{/* ${wallet.products.Price} */}</TableCell>
                    <TableCell>{/* {wallet.products[0].Min} */}</TableCell>
                    <TableCell>{/* {wallet.products[0].Max} */}</TableCell>
                    <TableCell>
                      <IncludedWalletRemove id={productId} walletId={wallet.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>

        <Button className="text-sm w-auto ml-auto" asChild>
          <Link href={``} className="inline">
            Exclude a Wallet Type
          </Link>
        </Button>

        <DialogTitle>
          Wallet that doesnot have access to{" "}
          {productName.charAt(0).toUpperCase() + productName.slice(1)}
        </DialogTitle>

        <ScrollArea className="max-h-[300px] mt-4 border rounded-md p-4">
          {excludedWallets.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No wallets are using this product
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet Type ID</TableHead>
                  <TableHead>Wallet Type Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {excludedWallets.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell>{wallet.id}</TableCell>
                    <TableCell>{wallet.name}</TableCell>
                    <TableCell>
                      <ExcludedWalletRemove id={wallet.id} />
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

export default ProductWalletsDialog;
