import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const PanelListingTable = ({ wallets }: { wallets: any[]}) => {
  return (
    <>
      {wallets?.map((wallet) => (
        <div
          key={wallet.id}
          className="p-2 mt-4 border-2 border-gray-300 rounded-lg"
        >
          <div className="text-lg capitalize font-semibold">{wallet.walletName}</div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{`${wallet.currencyCode} - ${wallet.balance}`}</TableCell>
                  <TableCell>
                    <Button className="bg-transparent text-black border border-gray-300 hover:bg-gray-100">
                    <Link href={`/money/record/${wallet.userId}/${wallet.userId}`}>Select Wallet</Link></Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </>
  );
};

export default PanelListingTable;
