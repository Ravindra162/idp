import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { MoneyTable } from "../../../_components/money-table";
import Link from "next/link";
import { auth } from "@/auth";
import TopBar from "@/app/(protected)/_components/Topbar";
import { db } from "@/lib/db";

export const generateMetadata = () => {
  return {
    title: "Money wallet | GrowonsMedia",
    description: "Money Record",
  };
};

type RecordProps = {
  params: { id: string; walletId: string };
  searchParams: { page: string };
};

const page = async ({ params, searchParams }: RecordProps) => {
  const wallet = await db.wallet.findUnique({
    where : {
      id : params.walletId
    }
  });
  console.log(params.walletId)
  console.log(wallet);
  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Wallet Records" />
      </div>
      <section className="space-y-4 md:max-h-[90vh] w-full md:w-[100%] p-2">
        <div className="flex items-center gap-x-2">
          <Button className="flex items-center " asChild>
            <Link href={`/money/payment-types/${wallet?.userId}/${wallet?.id}/${wallet?.walletTypeId}`} className="inline">
              <Image
                src="/svgs/plus.svg"
                alt="add money"
                width={20}
                height={20}
                className="h-6 w-6 mr-1"
              />
              Add Money here
            </Link>
          </Button>
        </div>
        <section>
          <MoneyTable
            userId={params.id.toString()}
            searchParams={searchParams}
            walletId={params.walletId.toString()}
          />
        </section>
      </section>
    </>
  );
};

export default page;
