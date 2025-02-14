import { db } from "@/lib/db";
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PaginationBar from "../../money/_components/PaginationBar";
import Search from "@/components/shared/search";
import EditDomainButton from "./edit-domain-button";

export const generateMetadata = () => ({
  title: "Admin Domains | GrowonsMedia",
  description: "Manage domains",
});

type AdminDomainsTableProps = {
  searchParams: { page: string };
};

const AdminDomainsTable = async ({ searchParams }: AdminDomainsTableProps) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const totalItemCount = await db.domain.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const domains = await db.domain.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: { products: true },
  });

  return (
    <section className="my-2">
      <h2 className="font-semibold text-xl mb-3">Admin Domains</h2>
      <Search fileName="panels" />
      <Table>
        <TableCaption>List of registered domains</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Domain Name</TableHead>
            <TableHead>Base URL</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No domains found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {domains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell className="font-medium">{domain.name}</TableCell>
              <TableCell>{domain.base_url}</TableCell>
              <TableCell>
                {/* <ViewProducts  /> */}
              </TableCell>
              <TableCell>
                <EditDomainButton id = {domain.id}/>
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
