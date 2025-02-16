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
import PaginationBar from "../../../money/_components/PaginationBar";
import Search from "@/components/shared/search";
import EditDomainButton from "../../_components/edit-domain-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const generateMetadata = () => ({
  title: "Admin Domains | GrowonsMedia",
  description: "Manage domains",
});

type AdminDomainsTableProps = {
  searchParams: { page: string };
};

const AdminDomainsTable = async ({ searchParams }: AdminDomainsTableProps) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 7;

  const totalItemCount = await db.domain.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const domains = await db.domain.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: { products: true },
  });

  return (
    <section className="m-2">
      <div className="flex justify-between items-center mb-4">
        <Button className="flex items-center " asChild>
          <Link href={`/admin/panels/add`} className="inline">
            <Image
              src="/svgs/plus.svg"
              alt="add money"
              width={20}
              height={20}
              className="h-6 w-6 mr-1"
            />
            Add Panel
          </Link>
        </Button>
      </div>

      <h2 className="font-semibold text-xl mb-3">Panels</h2>

      <Table>
        <TableCaption>List of registered panels</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Panel Name</TableHead>
            <TableHead>Description </TableHead>
            <TableHead>Base URL</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No Panels found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {domains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell className="font-medium">{domain.name}</TableCell>
              <TableCell>{domain.description}</TableCell>
              <TableCell>{domain.base_url}</TableCell>
              <TableCell>{/* <ViewProducts  /> */}</TableCell>
              <TableCell>
                <EditDomainButton id={domain.id} />
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

export default AdminDomainsTable;
