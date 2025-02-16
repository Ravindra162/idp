import { db } from "@/lib/db";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Search from "@/components/shared/search";
import PaginationBar from "@/app/(protected)/money/_components/PaginationBar";
import ModifyWalletType from "./wallet-modify";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getDomains } from "@/actions/admin-domains";
import ViewDomains from "@/app/(protected)/_components/view-domains";
import ViewPaymentTypes from "@/app/(protected)/_components/view-payment-types";

export const generateMetadata = () => ({
  title: "Admin Wallet Types | GrowonsMedia",
  description: "Manage wallet types",
});

type WalletTypesTableProps = {
  searchParams: { page: string };
};

const WalletTypesTable = async ({ searchParams }: WalletTypesTableProps) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 7;

  const totalItemCount = await db.walletType.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const walletTypes = await db.walletType.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const upWalletTypes = await Promise.all(
    walletTypes.map(async (walletType) => {
      const domains = await db.domain.findMany({
        where: { id: { in: walletType.domainId } },
      });

      const domainMap = domains.reduce((acc, domain) => {
        acc[domain.id] = domain.name;
        return acc;
      }, {} as Record<string, string>);

      return {
        ...walletType,
        domainNames: domainMap,
        domains: domains,
        paymentTypes: walletType.paymentType.map((type) => ({ name: type.toString() }))
      };
    })
  );

  return (
    <section className="m-2">
      <div className="flex justify-between items-center mb-4">
        <Button className="flex items-center " asChild>
          <Link href={`/admin/wallet-types/add`} className="inline">
            <Image
              src="/svgs/plus.svg"
              alt="add money"
              width={20}
              height={20}
              className="h-6 w-6 mr-1"
            />
            Add Wallet Type
          </Link>
        </Button>
      </div>
      <h2 className="font-semibold text-xl mb-3">Admin Wallet Types</h2>

      <Table>
        <TableCaption>List of registered wallet types</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet Type Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Currency Code</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Domains</TableHead>
            <TableHead>
              <div className="flex justify-end">
                <Search fileName="walletTypes" />
              </div>
            </TableHead>
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
          {upWalletTypes.map((walletType) => (
            <TableRow key={walletType.id}>
              <TableCell className="font-medium">{walletType.name}</TableCell>
              <TableCell>{walletType.description}</TableCell>
              <TableCell>{walletType.currencyCode}</TableCell>
              <TableCell>
                <ViewPaymentTypes paymentTypes={walletType.paymentTypes}/>
              </TableCell>
              <TableCell>
                <ViewDomains domains={walletType.domains} />
              </TableCell>
              <TableCell>
                <ModifyWalletType id={walletType.id} />
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
