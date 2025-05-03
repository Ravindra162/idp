import React from "react";
import ProductForm from "../../../../_components/product-form";
import { auth } from "@/auth";
import TopBar from "../../../../../../_components/Topbar";
import { db } from "@/lib/db";
import EditPanelQuantityForm from "../../../../_components/edit-include-panel-quantity-form";

export const generateMetadata = () => {
  return {
    title: "Edit Panel Quantity | GrowonsMedia",
    description: "Edit Panel Quantity",
  };
};

const page = async ({ params } : { params : { domainId : string; productId : string;}}) => {
  const session = await auth();
    const product = await db.productInfo.findFirst({
      where: { productId: params.productId, domainId : params.domainId  },
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
        <TopBar title={`Edit Panel Quantity ${params.domainId}`} />
      </nav>
      <section>
        <div className="m-4">
          <EditPanelQuantityForm domainId={params.domainId} productId={params.productId} name={product?.name ?? ""}
            minProduct={product?.Min ?? 0}
            maxProduct={product?.Max ?? 0}
            price={product?.Price ?? 0} />
        </div>
      </section>
    </>
  );
};

export default page;
