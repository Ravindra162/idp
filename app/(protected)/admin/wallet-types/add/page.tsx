import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../_components/Topbar";
import WalletForm, { PaymentMethodDetails } from "../_components/wallet-form";
import { getDomains } from "@/actions/admin-domains";
import { db } from "@/lib/db";

export const generateMetadata = () => {
  return {
    title: "Add Wallet Type | GrowonsMedia",
    description: "Add Wallet Type",
  };
};

const page = async () => {
  const session = await auth();

  const { paymentTypes, domains, paymentMethodDetails } = await fetchData();

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Add Wallet Type" />
      </nav>
      <section>
        <div className="m-4">
          <WalletForm domains={domains} paymentTypes={paymentTypes} paymentTypeMethodDetails={paymentMethodDetails} />
        </div>
      </section>
    </>
  );
};

async function fetchData() {
  try {

    const paymentTypesResponse = ["MANUAL", "PAYMENT_GATEWAY", "CUSTOM_METHOD"];

    const domainsResponse = await getDomains();

    const paymentTypeMethodDetails = await db.paymentTypeModel.findMany({
      where: {
        NOT: {
          paymentTypeMethod: "PAYMENT_GATEWAY",
        },
      },
    });

    const paymentMethodDetails: PaymentMethodDetails[] = paymentTypeMethodDetails.map((payment) => ({
      id: payment.id,
      public_id: payment.public_id,
      secure_url: payment.secure_url,
      upiid: payment.upiid,
      upinumber: payment.upinumber,
      accountDetails: payment.accountDetails,
      ifsccode: payment.ifsccode,
      accountType: payment.accountType,
      name: payment.name,
      bankName: payment.bankName,
    }));
    



    const paymentTypes = paymentTypesResponse.map((type) => ({ type }));

    return { paymentTypes, domains: domainsResponse.data || [] , paymentMethodDetails };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { paymentTypes: [], domains: [] , paymentMethodDetails : []};
  }
}

export default page;
