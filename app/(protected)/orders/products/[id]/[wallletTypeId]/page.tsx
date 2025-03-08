import React from "react";
import OrderForm from "../../../../_components/order-form";
import { db } from "@/lib/db";
import TopBar from "../../../../_components/Topbar";
import ProductOrderTable from "../../../../_components/product-order-table";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getFinalFilteredProducts } from "@/actions/user-products-fetch";

export const generateMetadata = () => {
  return {
    title: "Products | GrowonsMedia",
    description: "Products Listing page",
  };
};

const page = async ({ params }: { params: { id: string; wallletTypeId : string } }) => {

  const user = await db.user.findUnique({
    where : {
      id : params.id
    }
  })

  const proFilteredProducts = 
  (await getFinalFilteredProducts(user?.domainId ?? "", params.id, user?.teamId ?? "", params.wallletTypeId)) ?? [];

  const half = Math.ceil(proFilteredProducts.length / 2);
  const firstHalf = proFilteredProducts.slice(0, half);
  const secondHalf = proFilteredProducts.slice(half);

  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Products" />
      </div>
      <section className="space-y-4 md:max-h-[90vh] w-full md:w-[100%] p-2">
        <div className="flex items-center gap-x-2">
          <Button className="flex items-center " asChild>
            <Link href={`/orders/create/${params.id}/${params.wallletTypeId}`} className="inline">
              <Image
                src="/svgs/plus.svg"
                alt="add money"
                width={20}
                height={20}
                className="h-6 w-6 mr-1"
              />
              Create New Order
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 h-full w-full">
          <div>
            <ProductOrderTable products={firstHalf} />
          </div>
          <div>
            <ProductOrderTable products={secondHalf} />
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
