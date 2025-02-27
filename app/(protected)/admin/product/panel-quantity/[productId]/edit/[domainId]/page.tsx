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

const page = async ({ params } : { params : { domainId : string; productid : string;}}) => {
  const session = await auth();

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title={`Edit Panel Quantity ${params.domainId}`} />
      </nav>
      <section>
        <div className="m-4">
          <EditPanelQuantityForm domainId={params.domainId} productId={params.productid} />
        </div>
      </section>
    </>
  );
};

export default page;
