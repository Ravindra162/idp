import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../../_components/Topbar";
import { db } from "@/lib/db";
import EditTeamQuantityForm from "../../../_components/edit-include-team-quantity-form";
import AddTeamQuantityForm from "../../../_components/add-include-team-quantity-form";
import AddPanelQuantityForm from "../../../_components/add-include-panel-quantity-form";

export const generateMetadata = () => {
  return {
    title: "Add Panel Quantity | GrowonsMedia",
    description: "Add Panel Quantity",
  };
};

const page = async ({ params }: { params: { productid: string } }) => {
  const session = await auth();
  const panels = await db.domain.findMany({
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
        <TopBar title="Add Panel Quantity" />
      </nav>
      <section>
        <div className="m-4">
          <AddPanelQuantityForm productId={params.productid} panels={panels} />
        </div>
      </section>
    </>
  );
};

export default page;
