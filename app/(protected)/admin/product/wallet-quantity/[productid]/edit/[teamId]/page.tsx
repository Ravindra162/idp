import React from "react";
import ProductForm from "../../../../_components/product-form";
import { auth } from "@/auth";
import TopBar from "../../../../../../_components/Topbar";
import { db } from "@/lib/db";
import EditTeamQuantityForm from "../../../../_components/edit-include-team-quantity-form";

export const generateMetadata = () => {
  return {
    title: "Edit Team Quantity | GrowonsMedia",
    description: "Edit Team Quantity",
  };
};

const page = async ({ params } : { params : { teamId : string; productid : string;}}) => {
  const session = await auth();

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title={`Edit Team Quantity ${params.teamId}`} />
      </nav>
      <section>
        <div className="m-4">
          <EditTeamQuantityForm teamId={params.teamId} productId={params.productid} />
        </div>
      </section>
    </>
  );
};

export default page;
