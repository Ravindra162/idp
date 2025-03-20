import { formatPrice } from "@/components/shared/formatPrice";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableCell,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import React from "react";

type Wallet = {
  walletName: string;
  balance: number;
  currencyCode: string;
  ordersTotal: number;
  totalOrdersMoney: number;
  totalMoney: number;
};

const ViewWallets = ({ wallets }: { wallets: Wallet[] }) => {
  return (
    <Dialog>
      <DialogTrigger>
        View Wallets
      </DialogTrigger>
      <DialogContent>
        <Table>
          <TableCaption>List of Wallets for the User.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet Name</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Orders Total</TableHead>
              <TableHead>Total Orders Money</TableHead>
              <TableHead>Total Money</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wallets.map((wallet, index) => (
              <TableRow key={index}>
                <TableCell>{wallet.walletName}</TableCell>
                <TableCell>{formatPrice(wallet.balance, wallet.currencyCode)}</TableCell>
                <TableCell>{wallet.ordersTotal}</TableCell>
                <TableCell>{formatPrice(wallet.totalOrdersMoney, wallet.currencyCode)}</TableCell>
                <TableCell>{formatPrice(wallet.totalMoney, wallet.currencyCode)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ViewWallets;
