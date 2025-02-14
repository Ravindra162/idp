import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../_components/Topbar";
import DomainForm from "../../../_components/domain-form";

export const generateMetadata = () => {
  return {
    title: "Add Product | GrowonsMedia",
    description: "Add Product",
  };
};

const page = async () => {
  const session = await auth();
  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Panel" />
      </nav>
      <section>
        <div className="m-1">
          <DomainForm userId={session?.user.id || ""} />
        </div>
      </section>
    </>
  );
};

export default page;
