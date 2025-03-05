import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../../_components/Topbar";
import { db } from "@/lib/db";
import AddExcludeWalletQuantityForm from "../_components/add-exclude-wallet-quantity-form";

export const generateMetadata = () => {
  return {
    title: "Exclude WalletType | GrowonsMedia",
    description: "Exclude WalletType",
  };
};

const page = async ({ params }: { params: { productid: string } }) => {
  const session = await auth();
  const product = await db.product.findUnique({
    where: { id: params.productid },
    select: {
      productName: true,
      includedWalletTypeIds: true,
      excludedWalletTypeIds: true,
    },
  });
  const walletTypes = await db.walletType.findMany({
    where: {
      AND: [
        { id: { notIn: product?.includedWalletTypeIds } },
        { id: { notIn: product?.excludedWalletTypeIds } },
      ],
    },
    select: {
      id: true,
      name: true,
      products: {
        select: {
          productId: true,
          name: true,
          Price: true,
          Max: true,
          Min: true,
        },
      },
    },
  });

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Exclude WalletType" />
      </nav>
      <section>
        <div className="m-4">
          <AddExcludeWalletQuantityForm
            productId={params.productid}
            wallets={walletTypes}
            productName={product?.productName ?? ""}
          />
        </div>
      </section>
    </>
  );
};

export default page;
