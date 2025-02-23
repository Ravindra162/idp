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


const ViewPaymentTypes = ({ paymentTypes }: { paymentTypes: { name : string | null;}[] }) => {
  return (
    <Dialog>
      <DialogTrigger>View Payment Types</DialogTrigger>
      <DialogContent>
        <Table>
          <TableCaption>List of associated payment types.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Type Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentTypes.map((paymentType) => (
              <TableRow key={paymentType.name}>
                <TableCell>{paymentType.name}</TableCell> {/* Directly display the name */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPaymentTypes;
