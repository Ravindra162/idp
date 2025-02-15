import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../_components/Topbar";
import DomainForm from "../../_components/domain-form";
import {db} from "@/lib/db";

export const generateMetadata = () => {
  return {
    title: "Add Product | GrowonsMedia",
    description: "Add Product",
  };
};

type DomainProps = {
  id: string;
  name?: string;
  description?: string;
  base_url?: string;
  settingsId?: string;
};


const page = async ({params} : {params : {id : string}}) => {
  const session = await auth();

  const domainData = await db.domain.findUnique({
    where: { id: params.id },
  });

  // Convert database response to match DomainProps
  const domain: DomainProps | undefined = domainData
    ? {
        id: domainData.id,
        name: domainData.name,
        description: domainData.description ?? undefined,
        base_url: domainData.base_url,
        settingsId: domainData.settingsId,
      }
    : undefined;



  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Panel" />
      </nav>
      <section>
        <div className="m-1">
          <DomainForm userId={session?.user.id || ""} isEdit={true} domain={domain} />
        </div>
      </section>
    </>
  );
};

export default page;
