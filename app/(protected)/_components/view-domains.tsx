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

type Domain = {
  id: string;
  name: string;
  description: string | null;
};

const ViewDomains = ({ domains }: { domains: Domain[] }) => {
  return (
    <Dialog>
      <DialogTrigger>View Domains</DialogTrigger>
      <DialogContent>
        <Table>
          <TableCaption>List of associated domains.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Domain Name</TableHead>
              <TableHead>Domain Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id}>
                <TableCell>{domain.name}</TableCell>
                <TableCell>{domain.description ?? ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDomains;
