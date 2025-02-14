import { db } from "@/lib/db";
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Search from "@/components/shared/search";
import PaginationBar from "@/app/(protected)/money/_components/PaginationBar";
import ModifyWalletType from "./wallet-modify";


export const generateMetadata = () => ({
  title: "Admin Wallet Types | GrowonsMedia",
  description: "Manage wallet types",
});

type WalletTypesTableProps = {
  searchParams: { page: string };
};

const WalletTypesTable = async ({ searchParams }: WalletTypesTableProps) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const totalItemCount = await db.walletType.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const walletTypes = await db.walletType.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <section className="my-2">
      <h2 className="font-semibold text-xl mb-3">Admin Wallet Types</h2>
      <Search fileName="walletTypes" />
      <Table>
        <TableCaption>List of registered wallet types</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet Type Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Currency Code</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Domains</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No wallet types found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {walletTypes.map((walletType) => (
            <TableRow key={walletType.id}>
              <TableCell className="font-medium">{walletType.name}</TableCell>
              <TableCell>{walletType.description}</TableCell>
              <TableCell>{walletType.currencyCode}</TableCell>
              <TableCell>{walletType.paymentType}</TableCell>
              <TableCell>{walletType.domainId}</TableCell>
              <TableCell>
                <ModifyWalletType id = {walletType.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
};

export default WalletTypesTable;
