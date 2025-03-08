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
import { getDomains } from "@/actions/admin-domains";
import TopBar from "../../../../../_components/Topbar";
import PaymentTypesListingTable from "../../../_components/payment-types-listing-table";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export const generateMetadata = () => {
  return {
    title: "Wallets | GrowonsMedia",
    description: "Wallets Listing page",
  };
};

const page = async ({ params }: { params: { id: string, walletId : string; walletTypeId : string } }) => {
  const paymentMethods = await db.walletTypePayment.findMany({
    where: {
      walletTypeId : params.walletTypeId
    },
    include : {
        paymentModel : true
    }
  });
  let basehref = "";
  const wallets = paymentMethods;
  const half = Math.ceil(wallets.length / 2);
  const firstHalf = wallets.slice(0, half);
  const secondHalf = wallets.slice(half);
  console.log("---------------------")
  console.log(paymentMethods)
  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Payment Types" />
      </div>
      <section className="space-y-4 md:max-h-[90vh] w-full md:w-[100%] p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 h-full w-full">
          <div>
            <PaymentTypesListingTable paymentMethods={firstHalf} id = {params.id} walletId={params.walletId}/>
          </div>
          <div>
            <PaymentTypesListingTable paymentMethods={secondHalf} id = {params.id} walletId={params.walletId}/>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
