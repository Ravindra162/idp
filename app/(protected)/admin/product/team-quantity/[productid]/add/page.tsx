import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../../_components/Topbar";
import { db } from "@/lib/db";
import EditTeamQuantityForm from "../../../_components/edit-include-team-quantity-form";
import AddTeamQuantityForm from "../../../_components/add-include-team-quantity-form";

export const generateMetadata = () => {
  return {
    title: "Add Team Quantity | GrowonsMedia",
    description: "Add Team Quantity",
  };
};

const page = async ({ params } : { params : { productid : string;}}) => {
  const session = await auth();
    const teams = await db.team.findMany({
      select: {
        id: true,
        teamId: true,
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
        <TopBar title="Add Team Quantity" />
      </nav>
      <section>
        <div className="m-4">
          <AddTeamQuantityForm productId={params.productid} teams={teams} />
        </div>
      </section>
    </>
  );
};

export default page;
