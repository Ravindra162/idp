import Search from "@/components/shared/search";
import {
  Table,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import PaginationBar from "@/components/shared/search-paginationbar";
import EditDomainButton from "../../admin/_components/edit-domain-button";

const SearchPanel = async ({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) => {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const pageSize = 4;
  const query = searchParams.query || "";

  // Fetch total count
  const totalItemCount = await db.domain.count({
    where: {
      OR: [{ name: { mode: "insensitive", contains: query } }],
    },
  });

  const totalPages = Math.ceil(totalItemCount / pageSize);

  // Fetch paginated data
  const panels = await db.domain.findMany({
    where: {
      OR: [{ name: { mode: "insensitive", contains: query } }],
    },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  if (panels.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Search fileName="panel" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableFooter>
          <TableRow>
            <TableCell className="text-center" colSpan={3}>
              No panels found
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  return (
    <>
      <section className="md:overflow-auto md:max-h-[85vh] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Panel Name</TableHead>
              <TableHead>Panel Base URL</TableHead>
              <TableHead>Panel Products</TableHead>
              <TableHead>
                <Search fileName="panel" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {panels.map((panel) => (
              <TableRow key={panel.id}>
                <TableCell className="font-medium">{panel.name}</TableCell>
                <TableCell>{panel.base_url}</TableCell>
                <TableCell>{panel.base_url}</TableCell>
                <TableCell>
                <EditDomainButton id = {panel.id}/>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {totalPages > 1 && (
        <PaginationBar
          totalPages={totalPages}
          currentPage={currentPage}
          searchQuery={query}
        />
      )}
    </>
  );
};

export default SearchPanel;
