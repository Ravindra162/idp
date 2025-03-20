import React from "react";
import { auth } from "@/auth";

import { db } from "@/lib/db";
import TopBar from "@/app/(protected)/_components/Topbar";
import CustomerUserEditForm from "../../_components/edit_customer_user_form";
import { AccessType, ModuleName } from "@prisma/client";

export const generateMetadata = () => {
  return {
    title: "Add Custom User | GrowonsMedia",
    description: "Add Custom User",
  };
};

const page = async ({ params }: { params: { userId: string } }) => {
  const session = await auth();

  const customUserDetails = await db.customRole.findUnique({
    where: {
      userId: params.userId ?? "",
    },
    select: {
      modules: true,
    },
  });

  const accessTypesList = [
    {
      name: AccessType.EDIT,
    },
    { name: AccessType.VIEW },
  ];

  const modulesList = [
    {
      name: ModuleName.USER,
    },
    {
      name: ModuleName.ANALYTICS,
    },
    {
      name: ModuleName.INVOICE,
    },
    {
      name: ModuleName.ORDER,
    },
    {
      name: ModuleName.PRODUCT,
    },
    {
      name: ModuleName.TEAM,
    },
    {
      name: ModuleName.WALLETTYPES,
    },
    {
      name: ModuleName.WITHDRAWAL,
    },
  ];

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Create Custom User" />
      </nav>
      <section>
        <div className="m-4">
          <CustomerUserEditForm
            userId={params.userId}
            modulesList={modulesList}
            existingModules={JSON.parse(
              JSON.stringify(customUserDetails?.modules)
            )}
            accessTypesList={accessTypesList}
          />
        </div>
      </section>
    </>
  );
};

export default page;
