import React from "react";
import { auth } from "@/auth";
import TopBar from "../../../../../../_components/Topbar";
import { db } from "@/lib/db";
import AddIncludePaymentMethodsForm from "../../_components/add-include-payment-methods-form";
import { PaymentMethodDetails } from "../../../../_components/wallet-form";
import EditIncludePaymentMethodsForm from "../../_components/edit-include-payment-methods-form";

export const generateMetadata = () => {
  return {
    title: "Edit Payment Method | GrowonsMedia",
    description: "Edit Payment Method",
  };
};

const page = async ({ params }: { params: { walletTypeId: string } }) => {
  const session = await auth();

  const { paymentTypes, paymentMethodDetails } = await fetchData();

  
  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Payment Method" />
      </nav>
      <section>
        <div className="m-4">
          <EditIncludePaymentMethodsForm
            walletTypeId={params.walletTypeId}
            paymentTypes={paymentTypes}
            paymentTypeMethodDetails={paymentMethodDetails}
          />
        </div>
      </section>
    </>
  );
};

async function fetchData() {
  try {
    const paymentTypesResponse = ["MANUAL", "PAYMENT_GATEWAY", "CUSTOM_METHOD"];

    const paymentTypeMethodDetails = await db.paymentTypeModel.findMany({
      where: {
        NOT: {
          paymentTypeMethod: "PAYMENT_GATEWAY",
        },
      },
    });

    const paymentMethodDetails: PaymentMethodDetails[] =
      paymentTypeMethodDetails.map((payment) => ({
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

    return { paymentTypes, paymentMethodDetails };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { paymentTypes: [], paymentMethodDetails: [] };
  }
}

export default page;
