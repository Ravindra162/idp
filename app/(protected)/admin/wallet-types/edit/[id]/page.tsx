import React from "react";
import { auth } from "@/auth";
import EditWalletForm from "../../_components/edit-wallet-form";
import TopBar from "@/app/(protected)/_components/Topbar";

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
        <TopBar title="Edit Wallet Type" />
      </nav>
      <section>
        <div className="m-4">
          <EditWalletForm />
        </div>
      </section>
    </>
  );
};

export default page;
