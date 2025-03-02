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

const page = async ({
  params,
}: {
  params: { teamId: string; productid: string };
}) => {
  const session = await auth();
  const product = await db.productInfo.findFirst({
    where: { productId: params.productid, teamId: params.teamId },
    select: {
      name: true,
      Max : true,
      Min : true,
      Price : true
    },
  });

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title={`Edit Team Quantity ${params.teamId}`} />
      </nav>
      <section>
        <div className="m-4">
          <EditTeamQuantityForm
            teamId={params.teamId}
            productId={params.productid}
            name={product?.name ?? ""}
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
