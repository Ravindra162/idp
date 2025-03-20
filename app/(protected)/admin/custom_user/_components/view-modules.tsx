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

type Module = {
  name: string;
  accessType: number;
};

const ViewModules = ({ modules }: { modules: Module[] }) => {
  return (
    <Dialog>
      <DialogTrigger>View Modules</DialogTrigger>
      <DialogContent>
        <Table>
          <TableCaption>List of your modules.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Module Name</TableHead>
              <TableHead>Access Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{module.name}</TableCell>
                  <TableCell>{module.accessType}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ViewModules;
