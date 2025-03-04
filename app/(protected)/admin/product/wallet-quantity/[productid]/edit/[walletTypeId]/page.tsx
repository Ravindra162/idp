import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../../../_components/Topbar";
import { db } from "@/lib/db";
import EditWalletTypeQuantityForm from "../../_components/edit-include-wallet-quantity-form";

export const generateMetadata = () => {
  return {
    title: "Edit Wallet Type Quantity | GrowonsMedia",
    description: "Edit Wallet Type Quantity",
  };
};

const page = async ({
  params,
}: {
  params: { walletTypeId: string; productid: string };
}) => {
  const session = await auth();
  const product = await db.productInfo.findFirst({
    where: { productId: params.productid, walletTypeId: params.walletTypeId },
    select: {
      name: true,
      Max: true,
      Min: true,
      Price: true,
    },
  });

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title={`Edit WalletType Quantity `} />
      </nav>
      <section>
        <div className="m-4">
          <EditWalletTypeQuantityForm
            productId={params.productid}
            productName={product?.name ?? ""}
            walletTypeId={params.walletTypeId}
            minProduct={product?.Min ?? 0}
            maxProduct={product?.Max ?? 0}
            price={product?.Price ?? 0}
          />
        </div>
      </section>
    </>
  );
};

export default page;
