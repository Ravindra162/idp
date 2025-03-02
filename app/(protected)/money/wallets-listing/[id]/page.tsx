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
import TopBar from "../../../_components/Topbar";
import WalletsListingTable from "../_components/wallet-listing-table";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export const generateMetadata = () => {
  return {
    title: "Wallets | GrowonsMedia",
    description: "Wallets Listing page",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  const walletsResponse = await db.wallet.findMany({
    where: {
      userId: params.id,
    },
  });
  let basehref = "";
  const wallets = walletsResponse;
  const half = Math.ceil(wallets.length / 2);
  const firstHalf = wallets.slice(0, half);
  const secondHalf = wallets.slice(half);

  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Wallets" />
      </div>
      <section className="space-y-4 md:max-h-[90vh] w-full md:w-[100%] p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 h-full w-full">
          <div>
            <WalletsListingTable wallets={firstHalf} />
          </div>
          <div>
            <WalletsListingTable wallets={secondHalf} />
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
