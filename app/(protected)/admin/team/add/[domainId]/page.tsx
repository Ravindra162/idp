import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../_components/Topbar";
import TeamCreationForm from "../../_components/team-create-form";
import { db } from "@/lib/db";

export const generateMetadata = () => {
  return {
    title: "Add Payment Method | GrowonsMedia",
    description: "Add Payment Method",
  };
};

const page = async ({ params }: { params: { domainId: string } }) => {
  const session = await auth();

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where : {
      role : "USER"
    }
  });

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Create Team" />
      </nav>
      <section>
        <div className="m-4">
          <TeamCreationForm userId={session?.user.id || ""} users={users} domainId={params.domainId}/>
        </div>
      </section>
    </>
  );
};

export default page;
