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

const PanelListingTable = ({ domains }: { domains: any[] }) => {
  return (
    <>
      {domains?.map((domain) => (
        <div
          key={domain.id}
          className="p-2 mt-4 border-2 border-gray-300 rounded-lg"
        >
          <div className="text-lg capitalize font-semibold">{domain.name}</div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Base URL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{domain.base_url}</TableCell>
                  <TableCell>
                    <Button className="bg-transparent text-black border border-gray-300 hover:bg-gray-100">
                    <Link href={`/admin/user/table/${domain.id}`}>View Users</Link></Button>
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
