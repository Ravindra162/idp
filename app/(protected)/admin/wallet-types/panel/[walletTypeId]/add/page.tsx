import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../../_components/Topbar";
import { db } from "@/lib/db";
import AddPanelForm from "../../../_components/add-panel-form";

export const generateMetadata = () => {
  return {
    title: "Exclude Add Panel | GrowonsMedia",
    description: "Exclude Add Panel",
  };
};

const page = async ({ params }: { params: { walletTypeId: string } }) => {
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
        <TopBar title="Add Panel" />
      </nav>
      <section>
        <div className="m-4">
          <AddPanelForm walletTypeId={params.walletTypeId} panels={panels} />
        </div>
      </section>
    </>
  );
};

export default page;
