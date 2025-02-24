import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../../_components/Topbar";
import { db } from "@/lib/db";
import TeamEditForm from "../../../_components/team-edit-form";

export const generateMetadata = () => {
  return {
    title: "Add Payment Method | GrowonsMedia",
    description: "Add Payment Method",
  };
};

const page = async ({
  params,
}: {
  params: { domainId: string; id: string };
}) => {
  const session = await auth();

  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const team = await db.team.findUnique({
    where: { id: params.id },
    select : {
        teamId : true,
        name : true,
        description : true,
        leader : true,
        leaderId : true
    }
  });

  console.log("Params Id:-");
  console.log(params.id);
  console.log(params.domainId);

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Team" />
      </nav>
      <section>
        <div className="m-4">
          <TeamEditForm
            userId={session?.user.id || ""}
            users={users}
            domainId={params.domainId}
            team={team}
          />
        </div>
      </section>
    </>
  );
};

export default page;
