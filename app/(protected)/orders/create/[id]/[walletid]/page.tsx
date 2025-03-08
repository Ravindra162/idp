import React from "react";
import OrderForm from "../../../../_components/order-form";
import { db } from "@/lib/db";
import TopBar from "../../../../_components/Topbar";
import ProductOrderTable from "../../../../_components/product-order-table";
import { getFinalFilteredProducts } from "@/actions/user-products-fetch";

export const generateMetadata = () => {
  return {
    title: "Orders | GrowonsMedia",
    description: "Orders page",
  };
};

const page = async ({ params }: { params: { id: string, walletid : string } }) => {
   const user = await db.user.findUnique({
     where : {
       id : params.id
     }
   })

   const wallet = await db.wallet.findFirst({
    where : {
      userId : params.id,
      walletTypeId : params.walletid
    }
   });
 
   const mergedProducts = 
   (await getFinalFilteredProducts(user?.domainId ?? "", params.id, user?.teamId ?? "", params.walletid)) ?? [];
  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Add order" />
      </div>
      <section>
        <div className="m-3">
          <OrderForm
            id={params.id.toString()}
            products={mergedProducts}
            role={user?.role}
            walletId={wallet?.id ?? ""}
          >
            <ProductOrderTable products={mergedProducts} />
          </OrderForm>
        </div>
      </section>
    </>
  );
};

export default page;
