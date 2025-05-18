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
import { auth } from "firebase-admin";
import { PaymentType } from "@prisma/client";

const PaymentTypesListingTable = ({ paymentMethods, id, walletId }: { paymentMethods: any[], id : string, walletId : string}) => {
  return (
    <>
      {paymentMethods?.map((method) => {
        console.log(method)
        return (<div
          key={method.paymentModel.id}
          className="p-2 mt-4 border-2 border-gray-300 rounded-lg"
        >
          <div className="text-lg capitalize font-semibold">{method.paymentType === PaymentType.PAYMENT_GATEWAY ? `Payment Gateway` : `${method.paymentModel.name} - ${method.paymentModel.bankName}`}</div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{method.paymentType}</TableCell>
                  <TableCell>
                    <Button className="bg-transparent text-black border border-gray-300 hover:bg-gray-100">
                    <Link href={`/money/add/${id}/${walletId}/${method.paymentModel.id}`}>Select Payment Type</Link></Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )})}
    </>
  )
};

export default PaymentTypesListingTable;
