import React from "react";
import { auth } from "@/auth";

import { db } from "@/lib/db";
import TopBar from "@/app/(protected)/_components/Topbar";
import CustomerUserCreationForm from "../_components/add_customer_user_form";
import { AccessType, ModuleName } from "@prisma/client";

export const generateMetadata = () => {
  return {
    title: "Add Custom User | GrowonsMedia",
    description: "Add Custom User",
  };
};

const page = async () => {
  const session = await auth();

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      role: "USER",
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
          <CustomerUserCreationForm
            users={users}
            modulesList={modulesList}
            accessTypesList={accessTypesList}
          />
        </div>
      </section>
    </>
  );
};

export default page;
