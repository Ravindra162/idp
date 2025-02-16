import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../_components/Topbar";
import WalletForm from "../_components/wallet-form";
import { getDomains } from "@/actions/admin-domains";

export const generateMetadata = () => {
  return {
    title: "Add Wallet Type | GrowonsMedia",
    description: "Add Wallet Type",
  };
};

const page = async () => {
  const session = await auth();

  const { paymentTypes, domains } = await fetchData();

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Add Wallet Type" />
      </nav>
      <section>
        <div className="m-4">
          <WalletForm domains={domains} paymentTypes={paymentTypes} />
        </div>
      </section>
    </>
  );
};

async function fetchData() {
  try {

    const paymentTypesResponse = ["MANUAL", "PAYMENT_GATEWAY", "CUSTOM_METHOD"];

    const domainsResponse = await getDomains();


    const paymentTypes = paymentTypesResponse.map((type) => ({ type }));

    return { paymentTypes, domains: domainsResponse.data || [] };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { paymentTypes: [], domains: [] };
  }
}

export default page;
