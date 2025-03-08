import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/shared/auth/log-out-button";
import { LogOut } from "lucide-react";
import { auth } from "@/auth";
import { formatPrice } from "@/components/shared/formatPrice";
import { db } from "@/lib/db";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const WalletBalances = async ({
  userId,
}: {
  userId: string;
}) => {
  const session = await auth();
  const wallets = await db.wallet.findMany({
    where: {
      userId: userId,
    },
  });

  console.log("User Wallets:", wallets);
  return (
    <Dialog>
      <DialogTrigger>View Wallets</DialogTrigger>
      <DialogContent>
        <Table>
          <TableCaption>List of your wallets</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet Name</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wallets.map((wallet: any, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell>{wallet.walletName}</TableCell>
                  <TableCell>{formatPrice(wallet.balance, wallet.currencyCode)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default WalletBalances;
