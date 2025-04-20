import React from "react";
import { Bell } from "lucide-react";
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

const PanelListingTable = ({ domains }: { domains: any[]}) => {
  return (
    <>
      {domains?.map((domain) => (
        <div
          key={domain.id}
          className="relative p-2 mt-4 border-2 border-gray-300 rounded-lg"
        >
          {typeof domain.notifications === "number" && domain.notifications > 0 && (
              <div className="absolute top-2 right-2">
                <div className="relative">
                  <Bell className="w-6 h-6 text-blue-500" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
        {domain.notifications > 99 ? "99+" : domain.notifications}
      </span>
                </div>
              </div>
          )}
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
                    <Link href={domain.href}>View Details</Link></Button>
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
