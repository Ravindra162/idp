import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../../_components/Topbar";
import { db } from "@/lib/db";
import TeamEditForm from "../../../_components/team-edit-form";
import AddTeamMemberForm from "../../../_components/team-edit-limit-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ModifyTeamMembersForm from "../../../_components/add-team-users";

export const generateMetadata = () => {
  return {
    title: "Edit Limit | GrowonsMedia",
    description: "Edit Limit",
  };
};

const page = async ({
  params,
}: {
  params: { domainId: string; teamId: string };
}) => {
  const session = await auth();

  const users = await db.user.findMany({
    where: {
      role: "USER",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const team = await db.team.findUnique({
    where: { id: params.teamId },
    select: {
      id: true,
      amountLimit: true,
    },
  });

  console.log("Params Id:-");
  console.log(params.teamId);
  console.log(params.domainId);

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Team Member Details" />
      </nav>
      <section>
        <div className="m-4">
          <ModifyTeamMembersForm
            teamId= {params.teamId}
            domainId= {params.domainId}
          />
          <AddTeamMemberForm
            teamId={params.teamId}
            team={team}
            domainId={params.domainId}
          />
        </div>
      </section>
    </>
  );
};

export default page;
