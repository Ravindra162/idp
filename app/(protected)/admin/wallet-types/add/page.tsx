import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../_components/Topbar";
import DomainForm from "../../panels/_components/domain-form";
import WalletForm from "../_components/wallet-form";

export const generateMetadata = () => {
  return {
    title: "Add Wallet Type | GrowonsMedia",
    description: "Add Wallet Type",
  };
};

const page = async () => {
  const session = await auth();
  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Add Wallet Type" />
      </nav>
      <section>
        <div className="m-4">
          <WalletForm />
        </div>
      </section>
    </>
  );
};

export default page;
